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
	console.log($value);

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
</script>

{#if !input}
	<div class="slider">
		<!-- Decrease value button -->
		<button on:click={() => updateValue(-1)}>−</button>
		<!-- Slider label -->
		<label for="slider-input" class="input-label">{label}</label>
		<!-- Slider input -->
		<input
			bind:this={sliderElement}
			id="slider-input"
			class="input"
			style="--percentage: {(($value - min) / max) * 100}%"
			type="text"
			on:keydown|stopPropagation={(event) => {
				// Update value on arrow key presses
				if (event.key === 'ArrowLeft') {
					updateValue(-1);
				} else if (event.key === 'ArrowRight') {
					updateValue(1);
				}
			}}
			on:click={() => {
				// Focus and select input text on click
				sliderElement.focus();
				sliderElement.select();
			}}
			on:mousedown|stopPropagation|preventDefault={startSlide}
			on:blur={() => ($value = round($value, rounding))}
			bind:value={connection}
			aria-label={label}
		/>
		<!-- Increase value button -->
		<button on:click={() => updateValue(1)}>+</button>
	</div>
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
	}

	.input:active {
		cursor: none;
	}

	.input-label {
		margin-right: 0.5rem;
	}
</style>
