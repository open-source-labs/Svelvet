<!-- @migration-task Error while migrating Svelte code: Unexpected token
https://svelte.dev/e/js_parse_error -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token
https://svelte.dev/e/js_parse_error -->
<script lang="ts">
	import { getContext } from 'svelte';
	import { isArrow } from '$lib/types';
	import { roundNum, calculateRelativeCursor } from '$lib/utils';
	import { tracking } from '$lib/stores/CursorStore';
	import type { Graph, CustomWritable } from '$lib/types';
	import type { CSSColorString } from '$lib/types';

	$props = {
		minDegree: 60,
		maxDegree: 300,
		parameterStore: null,
		min: 0,
		max: 100,
		step: 1,
		label: 'Value',
		fixed: 0,
		fontColor: null,
		knobColor: 'lightblue',
		knobValueColor: 'white',
		indicatorColor: '#666565'
	};

	$state = {
		currentDegree: ((($props.parameterStore as number) - $props.min) / ($props.max - $props.min)) * ($props.maxDegree - $props.minDegree) + $props.minDegree,
		connected: typeof $props.parameterStore.set !== 'function',
		sliderWidth: 0,
		rotating: false,
		previousValue: $props.parameterStore,
		curAngle: `rotate(${((($props.parameterStore as number) - $props.min) / ($props.max - $props.minDegree)) * ($props.maxDegree - $props.minDegree) + $props.minDegree}deg`
	};

	const graph = getContext<Graph>('graph');

	const groups = graph.groups;
	const selected = $groups.selected;
	const activeGroup = graph.activeGroup;

	let knobWrapperElement: HTMLDivElement;
	let knobElement: HTMLDivElement;

	$derived cursor = graph.cursor;
	$derived scale = graph.transforms.scale;
	$derived translation = graph.transforms.translation;

	$effect(() => {
		if ($state.rotating) {
			calculateNewAngle($cursor.x, $cursor.y);
		}
	});

	function startRotate(e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		window.addEventListener('mouseup', stopRotate, { once: true });
		$state.rotating = true;
	}

	function startTouchRotate(e: TouchEvent) {
		$activeGroup = null;
		selected.nodes.set(new Set());
		tracking.set(false);
		e.stopPropagation();
		e.preventDefault();
		window.addEventListener('touchend', stopRotate, { once: true });
		$state.rotating = true;
	}

	function stopRotate() {
		if ($state.previousValue === $props.parameterStore) {
			knobElement.focus();
		} else {
			$state.previousValue = $props.parameterStore;
		}
		$state.rotating = false;
		window.removeEventListener('mouseup', stopRotate);
	}

	function rotatable(node: HTMLElement) {
		node.addEventListener('mousedown', startRotate);
		node.addEventListener('touchstart', startTouchRotate);
		return {
			destroy() {
				node.removeEventListener('mousedown', startRotate);
			}
		};
	}

	function updateValue(delta: number, increment = (($props.maxDegree - $props.minDegree) / ($props.max - $props.min)) * $props.step) {
		$state.currentDegree = roundNum(
			Math.max($props.minDegree, Math.min($state.currentDegree + delta * increment, $props.maxDegree)),
			3
		);
		$props.parameterStore =
			((clamp($state.currentDegree) - $props.minDegree) / ($props.maxDegree - $props.minDegree)) * ($props.max - $props.min) + $props.min;
	}

	export function clamp(num: number): number {
		const increment = (($props.maxDegree - $props.minDegree) / ($props.max - $props.min)) * $props.step;
		const degreeRoundToStep = Math.round((num - $props.minDegree) / increment) * increment + $props.minDegree;
		const degree = Math.min(Math.max(degreeRoundToStep, $props.minDegree), $props.maxDegree);
		$state.currentDegree = degree;
		return degree;
	}

	function calculateNewAngle(cursorX: number, cursorY: number): void {
		const { top, left, width, height } = knobWrapperElement.getBoundingClientRect();
		const e = { clientX: cursorX, clientY: cursorY };
		const { x, y } = calculateRelativeCursor(e, top, left, width, height, $scale, $translation);
		const relativeX = x + (2 * $translation.x) / $scale - width / 2;
		const relativeY = height / 2 - (y + (2 * $translation.y) / $scale);

		let angle =
			relativeX > 0 && relativeY > 0
				? 270 - Math.atan(relativeY / relativeX) * (180 / Math.PI)
				: relativeX < 0 && relativeY > 0
				? Math.atan(relativeY / -relativeX) * (180 / Math.PI) + 90
				: relativeX > 0 && relativeY < 0
				? 270 + Math.atan(-relativeY / relativeX) * (180 / Math.PI)
				: relativeX < 0 && relativeY < 0
				? 90 - Math.atan(-relativeY / -relativeX) * (180 / Math.PI)
				: $state.currentDegree;
		$props.parameterStore = Number(
			(((clamp(angle) - $props.minDegree) / ($props.maxDegree - $props.minDegree)) * ($props.max - $props.min) + $props.min).toFixed($props.fixed)
		);
	}
</script>

{#if !$state.connected}
	<div class="wrapper" style:color={$props.fontColor} bind:this={knobWrapperElement}>
		<div class="knob-container" bind:offsetWidth={$state.sliderWidth} style:transform={$state.curAngle}>
			<div
				tabindex={0}
				id="knob"
				class="knob"
				aria-label="knob component"
				role="slider"
				aria-valuemin={$props.min}
				aria-valuemax={$props.max}
				aria-valuenow={$props.parameterStore}
				style:background={$props.knobColor}
				onwheel|stopPropagation|preventDefault={(event) => {
					updateValue(Math.sign(event.deltaY));
				}}
				onkeydown|stopPropagation={(e) => {
					const { key } = e;

					if (isArrow(key)) {
						e.preventDefault();
						updateValue(key == 'ArrowDown' ? -1 : key == 'ArrowUp' ? 1 : 0);
					}
				}}
				use:rotatable
				bind:this={knobElement}
			/>
			<div class="indicator" style:background={$props.indicatorColor} />
		</div>
		<div class="knob-value" style:color={$props.knobValueColor}>
			{$props.parameterStore.toFixed($props.fixed)}
		</div>
	</div>
{:else}
	<div class="wrapper connected">
		<div class="knob connected" style:--percentage="10%" aria-label={$props.label}>
			<p>{$props.label}</p>
			<p>{$state.currentDegree}</p>
		</div>
	</div>
{/if}

<style>
	* {
		box-sizing: border-box;
	}

	.wrapper {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
		align-items: center;
		height: 7rem;
		width: 7rem;
	}

	.knob {
		display: flex;
		border-radius: 50%;
		width: 7rem;
		height: 7rem;
		pointer-events: auto;
		cursor: pointer;
		padding: 0.25rem;
	}

	.indicator {
		top: 80%;
		left: 48%;
		transform-origin: 50% -50%;
		position: absolute;
		width: 4%;
		height: 15%;
		background-color: #666565;
		border-radius: 30%/10%;
		pointer-events: none;
	}
	.knob-value {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, 50%);
		font-size: 2.5em;
		color: white;
		z-index: 100;
	}

	.connected {
		display: flex;
		justify-content: space-between;
		padding: 0.25rem 0.5rem;
	}
</style>
