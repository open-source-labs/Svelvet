<script lang="ts">
	import { activeKeys } from '$lib/stores';
	import { writable, type Writable } from 'svelte/store';

	export let value: Writable<any> = writable(0.5);
	export let min = 0;
	export let max = 100;
	export let step = 1;
	export let rounding = 3;
	export let label = 'Value';
	export let driven = false;
	export let input: null | unknown = null;
	const numbers = new Set(['.', 'Enter', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']);

	let sliding = false;

	$: connection = $value.value || $value;

	// Begin sliding on mousedown
	function startSlide() {
		sliding = true;
	}

	// Stop sliding on mouseup
	function stopSlide() {
		sliding = false;
	}

	// Slide on mousemove if sliding is true
	function slide(event: MouseEvent) {
		if (sliding) {
			const { movementX } = event;
			updateValue(Math.sign(movementX), step);
		}
	}

	// Update the value based on the direction and increment
	function updateValue(direction: number, increment = step) {
		const newValue = round($value + increment * direction, rounding);
		console.log(newValue);
		if (newValue >= min && newValue <= max) {
			$value = newValue;
		}
	}

	// Round the number to a specific number of significant digits
	function round(number: number, significantDigits: number) {
		if (number === 0) {
			return 0;
		}
		const scale = Math.pow(10, significantDigits - 1 - Math.floor(Math.log10(Math.abs(number))));
		return Math.round(number * scale) / scale;
	}
	let sliderElement: HTMLInputElement;

	function validateInput() {
		const number = parseFloat(sliderElement.value);
		if (Number.isNaN(number)) {
			sliderElement.value = $value;
		}
		if (number < min) {
			$value = min;
		} else if (number > max) {
			$value = max;
		} else {
			$value = number;
		}

		sliderElement.blur();
	}
</script>

{#if !input}
	<button on:click={() => updateValue(-1)}>−</button>
	<div class="slider">
		<!-- Decrease value button -->

		<!-- Slider label -->
		<label for="slider-input" class="input-label">{label}</label>
		<!-- Slider input -->
		<input
			bind:this={sliderElement}
			id="slider-input"
			class="input"
			style="--percentage: {(($value - min) / max) * 100}%"
			type="text"
			on:wheel|stopPropagation|preventDefault={(event) => {
				// Update value on mouse wheel scroll
				updateValue(Math.sign(event.deltaY), step);
			}}
			on:keydown|stopPropagation={(e) => {
				const { key } = e;

				if (!numbers.has(key)) return;

				if (key === 'Enter') {
					validateInput();
				}
			}}
			on:blur={validateInput}
			on:click={() => {
				// Focus and select input text on click
				sliderElement.focus();
				sliderElement.select();
			}}
			on:mousedown|stopPropagation|preventDefault={startSlide}
			value={connection}
			aria-label={label}
		/>
		<!-- Increase value button -->
	</div>
	<button on:click={() => updateValue(1)}>+</button>
{:else}
	<p>{label}</p>
{/if}

<svelte:window on:mousemove={slide} on:mouseup|stopPropagation={stopSlide} />

<style>
	.input {
		background: linear-gradient(
			90deg,
			rgb(91, 169, 190) var(--percentage),
			rgb(255, 255, 255) var(--percentage)
		);
		border: solid 1px rgb(57, 57, 57);
		border-radius: 6px;
		text-align: right;
		width: 100%;
		height: 100%;
		cursor: ew-resize;
	}

	button {
		background: none;
		border: none;
		font-size: 1.5rem;
		color: white;
		cursor: pointer;
	}
	button:hover {
		color: rgb(91, 169, 190);
	}

	.input:active {
		cursor: none;
	}

	.input-label {
		margin-left: 0.5rem;
		position: absolute;
		pointer-events: none;
	}
	.slider {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100%;
	}
</style>
