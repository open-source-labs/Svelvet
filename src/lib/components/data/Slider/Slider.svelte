<script lang="ts">
	import { type Graph, isArrow, type CustomWritable } from '$lib/types';
	import { initialClickPosition } from '$lib/stores/CursorStore';
	import { getContext } from 'svelte';

	export let parameterStore: CustomWritable<number>;
	export let min = 0;
	export let max = 100;
	export let step = 1;
	export let label = 'Value';

	$: connected = typeof parameterStore.set !== 'function';

	let graph = getContext<Graph>('graph');

	let sliderWidth: number; // Width of slider on DOM (relative to scale)
	let sliderElement: HTMLInputElement;
	let sliding = false; // Whether the slider is currently being dragged
	let previousX = 0; // Represents previous cursor position
	let pixelsMoved = 0; // Number of pixels moved during slide

	// Grab cursor from store
	$: cursor = graph.cursor;

	$: if (sliding) {
		const deltaX = $cursor.x - previousX;
		calculateSlide(deltaX);
		previousX = $cursor.x;
	}

	// Begin sliding on mousedown
	function startSlide(e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		$initialClickPosition = { x: $cursor.x, y: $cursor.y };
		previousX = $cursor.x;
		window.addEventListener('mouseup', stopSlide, { once: true });
		sliding = true;
	}

	// Stop sliding on mouseup
	function stopSlide() {
		if (Math.abs(previousX - $cursor.x) <= 1.5) {
			sliderElement.focus();
			sliderElement.select();
		}
		sliding = false;
		window.removeEventListener('mouseup', stopSlide);
	}

	function slideable(node: HTMLElement) {
		node.addEventListener('mousedown', startSlide);
		return {
			destroy() {
				node.removeEventListener('mousedown', startSlide);
			}
		};
	}

	// Update the value based on the direction and increment
	function updateValue(delta: number, increment = step) {
		if (typeof $parameterStore !== 'number') return;
		$parameterStore = Math.max(min, Math.min($parameterStore + delta * increment, max));
	}

	function calculateSlide(cursorChange: number, increment = step) {
		if (typeof $parameterStore !== 'number') return;
		const pixelsToMove = sliderWidth / ((max - min) / increment);
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
				$parameterStore = number;
			}
		}
		// For some reason, this line is necessary
		// Absurdly large or small numbers do not get reset without it
		sliderElement.value = JSON.stringify($parameterStore);
		sliderElement.blur();
	}

	$: percentageSlid = ((($parameterStore as number) - min) / max) * 100;
	$: CSSpercentage = `${percentageSlid}%`;
</script>

{#if !connected}
	<div class="wrapper">
		<button class="button" on:click={() => updateValue(-1)}>−</button>
		<div class="slider" bind:clientWidth={sliderWidth}>
			<label for="slider-input" class="input-label">{label}</label>
			<input
				tabindex={0}
				id="slider-input"
				class="slider-input"
				style:--percentage={CSSpercentage}
				type="text"
				value={$parameterStore}
				aria-label={label}
				on:wheel|stopPropagation|preventDefault={(event) => {
					updateValue(Math.sign(event.deltaY), step);
				}}
				on:keydown|stopPropagation={(e) => {
					const { key } = e;

					if (isArrow(key)) {
						e.preventDefault(); // Stops cursor from moving
						updateValue(key == 'ArrowDown' ? -1 : key == 'ArrowUp' ? 1 : 0);
					}

					if (key === 'Enter') validateInput();
				}}
				use:slideable
				bind:this={sliderElement}
			/>
		</div>
		<button class="button" on:click={() => updateValue(1)}>+</button>
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
	.slider-input {
		background: linear-gradient(
			90deg,
			rgb(32, 128, 143) var(--percentage),
			rgb(0, 0, 0) var(--percentage)
		);
		border: solid 1px rgb(57, 57, 57);
		border-radius: 6px;
		text-align: right;
		width: 100%;
		height: 100%;
		cursor: ew-resize;
		color: white;
		padding: 0.25rem;
		pointer-events: auto;
	}

	.wrapper {
		display: flex;
		gap: 0.5rem;
	}

	.button {
		background: none;
		border: none;
		font-size: 1.5rem;
		color: white;
		cursor: pointer;
	}
	.button:hover {
		color: rgb(91, 169, 190);
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
	}
</style>
