<script lang="ts">
	import { run, stopPropagation, preventDefault } from 'svelte/legacy';

	import { initialClickPosition } from '$lib/stores/CursorStore';
	import { getContext } from 'svelte';
	import { isArrow } from '$lib/types';
	import { roundNum } from '$lib/utils';
	import { tracking } from '$lib/stores/CursorStore';
	import type { Graph, Node, CustomWritable } from '$lib/types';
	import type { CSSColorString } from '$lib/types';

	
	interface Props {
		// Props
		parameterStore: CustomWritable<number>;
		min?: number;
		max?: number;
		step?: number;
		label?: string;
		fixed?: number;
		fontColor?: CSSColorString | null;
		barColor?: CSSColorString | null;
		bgColor?: CSSColorString | null;
	}

	let {
		parameterStore,
		min = 0,
		max = 100,
		step = 1,
		label = 'Value',
		fixed = 2,
		fontColor = null,
		barColor = null,
		bgColor = null
	}: Props = $props();


	let graph = getContext<Graph>('graph');
	let node = getContext<Node>('node');

	const groups = graph.groups;
	const selected = $groups.selected;
	const activeGroup = graph.activeGroup;


	let sliderWidth: number = $state(); // Width of slider on DOM (relative to scale)
	let sliderElement: HTMLInputElement = $state();
	let sliding = $state(false); // Whether the slider is currently being dragged
	let previousX = $state(0); // Represents previous cursor position
	let pixelsMoved = 0; // Number of pixels moved during slide



	// Begin sliding on mousedown
	function startSlide(e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		$initialClickPosition = { x: $cursor.x, y: $cursor.y };
		previousX = $cursor.x;
		window.addEventListener('mouseup', stopSlide, { once: true });
		sliding = true;
	}
	let previousValue = $parameterStore;
	function startTouchSlide(e: TouchEvent) {
		$activeGroup = null;
		selected.nodes.set(new Set());
		tracking.set(false);
		e.stopPropagation();
		e.preventDefault();
		$initialClickPosition = { x: $cursor.x, y: $cursor.y };
		previousX = $cursor.x;
		window.addEventListener('touchend', stopSlide, { once: true });
		sliding = true;
	}

	// Stop sliding on mouseup
	function stopSlide() {
		if (previousValue === $parameterStore) {
			sliderElement.focus();
			sliderElement.select();
		} else {
			previousValue = $parameterStore;
		}
		sliding = false;
		window.removeEventListener('mouseup', stopSlide);
	}

	function slideable(node: HTMLElement) {
		node.addEventListener('mousedown', startSlide);
		node.addEventListener('touchstart', startTouchSlide);
		return {
			destroy() {
				node.removeEventListener('mousedown', startSlide);
			}
		};
	}

	// Update the value based on the direction and increment
	function updateValue(delta: number, increment = step) {
		if (typeof $parameterStore !== 'number') return;
		$parameterStore = roundNum(
			Math.max(min, Math.min($parameterStore + delta * increment, max)),
			3
		);
	}

	function calculateSlide(cursorChange: number, increment = step) {
		if (typeof $parameterStore !== 'number') return;
		const pixelsToMove = ($width * 0.7) / ((max - min) / increment);
		pixelsMoved += cursorChange;

		if (Math.abs(pixelsMoved) >= pixelsToMove) {
			const incrementsToMove = Math.floor(Math.abs(pixelsMoved) / pixelsToMove);
			if (pixelsMoved > 0) {
				updateValue(incrementsToMove);
			} else {
				updateValue(-incrementsToMove);
			}
			pixelsMoved =
				pixelsMoved > 0
					? pixelsMoved - incrementsToMove * pixelsToMove
					: pixelsMoved + incrementsToMove * pixelsToMove;
		}
	}

	// This prevents users from typing in invalid characters
	function validateInput() {
		const number = parseFloat(sliderElement.value);
		if (!Number.isNaN(number)) {
			if (number <= min) {
				$parameterStore = min;
			} else if (number >= max) {
				$parameterStore = max;
			} else {
				$parameterStore = roundNum(number, 2);
			}
		}
		// For some reason, this line is necessary
		// Absurdly large or small numbers do not get reset without it
		sliderElement.value = JSON.stringify($parameterStore);
		sliderElement.blur();
	}



	// Add validation for input values to ensure they are within the min and max range
	function validateInputValue() {
		if ($parameterStore < min) {
			$parameterStore = min;
		} else if ($parameterStore > max) {
			$parameterStore = max;
		}
	}

	let connected = $derived(typeof parameterStore.set !== 'function');
	let width = $derived(node.dimensions.width);
	// Grab cursor from store
	let cursor = $derived(graph.cursor);
	run(() => {
		if (sliding) {
			const deltaX = $cursor.x - previousX;
			calculateSlide(deltaX);
			previousX = $cursor.x;
		}
	});
	let percentageSlid = $derived(((($parameterStore as number) - min) / (max - min)) * 100);
	let CSSpercentage = $derived(`${percentageSlid}%`);
	let sliderStyle = $derived(`linear-gradient(
			90deg,
			${barColor || 'var(--primary-color, var(--default-primary-color))'} ${CSSpercentage},
			${bgColor || 'var(--accent-color, var(--default-accent-color))'} ${CSSpercentage}
		)`);
	// Handle edge cases for sliding and input value changes
	run(() => {
		if ($parameterStore < min) {
			$parameterStore = min;
		} else if ($parameterStore > max) {
			$parameterStore = max;
		}
	});
</script>

{#if !connected}
	<div class="wrapper" style:color={fontColor}>
		<button
			class="button"
			ontouchstart={stopPropagation(() => updateValue(-1))}
			onmousedown={stopPropagation(() => updateValue(-1))}>−</button
		>
		<div class="slider" bind:offsetWidth={sliderWidth}>
			<label for="slider-input" class="input-label">{label}</label>
			<input
				tabindex={0}
				id="slider-input"
				class="slider-input"
				style:background={sliderStyle}
				style:--percentage={CSSpercentage}
				type="text"
				value={$parameterStore.toFixed(fixed)}
				aria-label={label}
				onwheel={stopPropagation(preventDefault((event) => {
					updateValue(Math.sign(event.deltaY), step);
				}))}
				onkeydown={stopPropagation((e) => {
					const { key } = e;

					if (isArrow(key)) {
						e.preventDefault(); // Stops cursor from moving
						updateValue(key == 'ArrowDown' ? -1 : key == 'ArrowUp' ? 1 : 0);
					}

					if (key === 'Enter') validateInput();
				})}
				use:slideable
				bind:this={sliderElement}
				oninput={validateInputValue}
			/>
		</div>
		<button
			class="button"
			ontouchstart={stopPropagation(() => updateValue(1))}
			onmousedown={stopPropagation(() => updateValue(1))}>+</button
		>
	</div>
{:else}
	<div class="wrapper connected">
		<div class="slider-input connected" style:--percentage="100%" aria-label={label}>
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
	}

	.slider-input {
		border: none;
		border-radius: 6px;
		color: inherit;
		text-align: right;
		width: 100%;
		height: 1.5rem;
		cursor: ew-resize;
		padding: 0.25rem;
		pointer-events: auto;
	}

	.button {
		background: none;
		border: none;
		font-size: 1.5rem;
		color: inherit;
		line-height: 1rem;
		cursor: pointer;
		display: flex;
		align-items: baseline;
		justify-content: center;
	}
	.button:hover {
		opacity: 50%;
	}

	.slider {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100%;
		pointer-events: auto;
	}

	.connected {
		display: flex;
		justify-content: space-between;
		padding: 0.25rem 0.5rem;
	}
	.input-label {
		margin-left: 0.5rem;
		position: absolute;
		pointer-events: none;
		color: inherit;
	}
</style>
