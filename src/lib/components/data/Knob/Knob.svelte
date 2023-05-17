<script lang="ts">
	import { initialClickPosition } from '$lib/stores/CursorStore';
	import { getContext, onMount } from 'svelte';
	import { isArrow } from '$lib/types';
	import { roundNum } from '$lib/utils';
	import { tracking } from '$lib/stores/CursorStore';
	import type { Graph, Node, CustomWritable } from '$lib/types';
	import type { CSSColorString } from '$lib/types';
	import { writable } from 'svelte/store';

	// Props
	// users should be able to customize: min, max, minDegree, maxDegree, step, subdivision, fixed
	// export let parameterStore: CustomWritable<number> ;
	export let minDegree = 60;
	export let maxDegree = 300;
	// export let curDegree = minDegree; // current angle in relation to vertical y bottom
	export let parameterStore: CustomWritable<number>; // FIXME: how to set the initial position to minDegree?
	export let min = 0;
	export let max = 100;
	export let step = 1;
	export let label = 'Value';
	/**
	 * @default "2"
	 * @description Precision in decimal places.
	 * for output anchors or anchors that have not specified an input/output prop.
	 */
	export let fixed = 0;
	export let fontColor: CSSColorString | null = null;
	// export let barColor: CSSColorString | null = null;
	// export let bgColor: CSSColorString | null = null;

	$: connected = typeof parameterStore.set !== 'function';

	let graph = getContext<Graph>('graph');
	let node = getContext<Node>('node');

	const groups = graph.groups;
	const selected = $groups.selected;
	const activeGroup = graph.activeGroup;

	$: width = node.dimensions.width;
	$: height = node.dimensions.height;

	// TODO: need to rename these variables
	let sliderWidth: number; // Width of knob on DOM (relative to scale)
	let knobContainerElement: HTMLDivElement;
	let knobElement: HTMLDivElement;
	let sliding = false; // Whether the knob is currently being dragged
	let previousX = 0; // Represents previous cursor position
	let previousAngle = 0;
	let pixelsMoved = 0; // Number of pixels moved during slide
	let rotating = false;

	// Grab cursor from store
	$: cursor = graph.cursor;

	// when the knob is rotating
	$: if (rotating) {
		$parameterStore = calculateNewAngle([$cursor.x, $cursor.y], getElementCenter());
	}

	// Begin rotating on mousedown
	function startRotate(e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		window.addEventListener('mouseup', stopRotate, { once: true });
		rotating = true;
	}

	let previousValue = $parameterStore;

	// TODO:
	function startTouchRotate(e: TouchEvent) {
		$activeGroup = null;
		selected.nodes.set(new Set());
		tracking.set(false);
		e.stopPropagation();
		e.preventDefault();
		window.addEventListener('touchend', stopRotate, { once: true });
		rotating = true;
	}

	// Done: Stop rotating on mouseup
	function stopRotate() {
		if (previousValue === $parameterStore) {
			knobElement.focus(); // sets focus on the this element
		} else {
			previousValue = $parameterStore;
		}
		rotating = false;
		window.removeEventListener('mouseup', stopRotate);
	}

	// Done: set eventlisteners that enable rotating
	function rotatable(node: HTMLElement) {
		node.addEventListener('mousedown', startRotate);
		node.addEventListener('touchstart', startTouchRotate);
		return {
			destroy() {
				node.removeEventListener('mousedown', startRotate);
			}
		};
	}

	// Update the value based on the direction and increment
	function updateValue(delta: number, increment = ((maxDegree - minDegree) / (max - min)) * step) {
		// if (typeof $parameterStore !== 'number') return; //dont think we need this anymore since no longer an input
		$parameterStore = roundNum(
			Math.max(minDegree, Math.min($parameterStore + delta * increment, maxDegree)),
			3
		);
	}

	// $: knobValue = ((($parameterStore as number) - min) / (max - min)) * (maxDegree - minDegree); //why do we need to cast as number????
	// $: angle = `rotate(${minDegree + knobValue}deg`;
	$: curAngle = `rotate(${$parameterStore}deg`;
	$: curValue = ($parameterStore / (maxDegree - minDegree)) * (max - min) + min;

	function clamp(num: number): number {
		const increment = ((maxDegree - minDegree) / (max - min)) * step;
		const degreeRoundToStep = Math.round((num - minDegree) / increment) * increment + minDegree;
		const degree = Math.min(Math.max(degreeRoundToStep, minDegree), maxDegree);
		return degree;
	}

	// get the coordiates of the center of the knob
	function getElementCenter(): [number, number] {
		const { top, left, width, height } = knobContainerElement.getBoundingClientRect();
		console.log('width,', width, 'height:', height);
		console.log('left,', left, 'top:', top);
		console.log('center: ', [left + width / 2, top + height / 2]);

		return [left + width / 2, top + height / 2];
	}

	function calculateNewAngle(
		[cursorX, cursorY]: [number, number],
		[centerX, centerY]: [number, number]
	): number {
		const x = cursorX - centerX;
		const y = centerY - cursorY;

		// degree in relation to vertical
		let angle =
			x > 0 && y > 0
				? 270 - Math.atan(y / x) * (180 / Math.PI)
				: x < 0 && y > 0
				? Math.atan(y / -x) * (180 / Math.PI) + 90
				: x > 0 && y < 0
				? 270 + Math.atan(-y / x) * (180 / Math.PI)
				: x < 0 && y < 0
				? 90 - Math.atan(-y / -x) * (180 / Math.PI)
				: $parameterStore - minDegree;
		return clamp(angle);
	}
</script>

{#if !connected}
	<!-- this div is wrapping the knob input section -->
	<div class="wrapper" style:color={fontColor}>
		<div
			class="knob-container"
			bind:offsetWidth={sliderWidth}
			bind:this={knobContainerElement}
			style:transform={curAngle}
		>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<div
				tabindex={0}
				id="knob"
				class="knob"
				aria-label="knob component"
				on:wheel|stopPropagation|preventDefault={(event) => {
					updateValue(Math.sign(event.deltaY)); // FIXME:
				}}
				on:keydown|stopPropagation={(e) => {
					const { key } = e;

					if (isArrow(key)) {
						e.preventDefault(); // Stops cursor from moving
						updateValue(key == 'ArrowDown' ? -1 : key == 'ArrowUp' ? 1 : 0); // FIXME:
					}

					// if (key === 'Enter') validateInput();
				}}
				use:rotatable
				bind:this={knobElement}
			/>
			<div class="indicator" />
		</div>
		<div class="knob-value">
			{((($parameterStore - minDegree) / (maxDegree - minDegree)) * (max - min) + min).toFixed(
				fixed
			)}
			<!-- {$parameterStore.toFixed(fixed)} -->
		</div>
	</div>
{:else}
	<div class="wrapper connected">
		<div class="knob connected" style:--percentage="10%" aria-label={label}>
			<p>{label}</p>
			<p>{$parameterStore}</p>
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
		border: 1px solid red;
		height: 11rem;
		width: 11rem;
		/* cursor: ew-resize; */
	}

	.knob {
		display: flex;
		border-radius: 50%;
		width: 10rem;
		height: 10rem;
		pointer-events: auto;
		cursor: pointer;
		padding: 0.25rem;
		box-shadow: 0 0 2px 1px #c7a472;
		background-color: lightblue;
	}

	.indicator {
		top: 75%;
		left: 48%;
		transform-origin: 50% -50%;
		position: absolute;
		/* transform: ro÷tate(30 deg); */
		width: 4%;
		height: 20%;
		background: black;
		box-shadow: 0 0 2px white;
		border-radius: 30%/10%;
		pointer-events: none;
	}
	.knob-value {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, 50%);
		font-size: 3em;
		color: white;
		z-index: 100;
	}

	.connected {
		display: flex;
		justify-content: space-between;
		padding: 0.25rem 0.5rem;
		border: 10px red solid;
	}
</style>
