<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import type { Parameter } from '$lib/types';
	import { cursorPosition, initialClickPosition } from '$lib/stores/CursorStore';
	import { get } from 'svelte/store';

	export let parameterStore: Writable<Parameter> = writable(0.5);
	export let min = 0;
	export let max = 100;
	export let step = 1;
	export let rounding = 3;
	export let label = 'Value';
	export let driven = false;
	export let input: null | unknown = null;

	const validInput = new Set([
		'.',
		'Enter',
		'ArrowUp',
		'ArrowDown',
		'0',
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'.'
	]);

	let sliding = false;

	$: previous = parameterStore;

	$: if (parameterStore !== previous) {
		driven = !driven;
	}

	// Begin sliding on mousedown
	function startSlide() {
		window.addEventListener('mouseup', stopSlide, { once: true });
		sliding = true;
	}

	// Stop sliding on mouseup
	function stopSlide() {
		sliding = false;
		window.removeEventListener('mouseup', stopSlide);
	}

	const { x: initialX, y: initialY } = $initialClickPosition;
	const { x: cursorX, y: cursorY } = cursorPosition;
	let previousX = initialX;

	$: if (sliding) {
		updateValue(Math.sign(($cursorX - previousX) / 10), step);
		previousX = get(cursorX);
	}

	// Update the value based on the direction and increment
	function updateValue(direction: number, increment = step) {
		const newValue = round($parameterStore + increment * direction, rounding);
		console.log(newValue);
		if (newValue >= min && newValue <= max) {
			$parameterStore = newValue;
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
			sliderElement.value = $parameterStore.toString();
		}
		if (number < min) {
			$parameterStore = min;
		} else if (number > max) {
			$parameterStore = max;
		} else {
			$parameterStore = number;
		}

		sliderElement.blur();
	}
</script>

{#if !input}
	<button class="button" on:click={() => updateValue(-1)}>−</button>
	<div class="slider">
		<label for="slider-input" class="input-label">{label}</label>

		<input
			bind:this={sliderElement}
			id="slider-input"
			class="slider-input"
			class:driven
			style="--percentage: {(($parameterStore - min) / max) * 100}%"
			type="text"
			on:wheel|stopPropagation|preventDefault={(event) => {
				// Update value on mouse wheel scroll
				updateValue(Math.sign(event.deltaY), step);
			}}
			on:keydown|stopPropagation={(e) => {
				const { key } = e;

				if (!validInput.has(key)) return;

				if (key === 'ArrowUp') {
					e.preventDefault(); // Stops cursor from moving
					updateValue(1);
				} else if (key === 'ArrowDown') {
					e.preventDefault(); // Stops cursor from moving
					updateValue(-1);
				}

				if (key === 'Enter') validateInput();
			}}
			on:blur={validateInput}
			on:click={() => {
				// Focus and select input text on click
				sliderElement.focus();
				sliderElement.select();
			}}
			on:mousedown|stopPropagation|preventDefault={startSlide}
			value={$parameterStore}
			aria-label={label}
		/>
	</div>
	<button class="button" on:click={() => updateValue(1)}>+</button>
{:else}
	<p>{label}</p>
{/if}

<style>
	@import url('./Slider.css');
</style>
