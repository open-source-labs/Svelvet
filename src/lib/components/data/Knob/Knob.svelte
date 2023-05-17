<script lang="ts">
	import { initialClickPosition } from '$lib/stores/CursorStore';
	import { getContext, onMount } from 'svelte';
	import { isArrow } from '$lib/types';
	import { roundNum } from '$lib/utils';
	import { tracking } from '$lib/stores/CursorStore';
	import type { Graph, Node, CustomWritable } from '$lib/types';
	import type { CSSColorString } from '$lib/types';

	// Props
	// users should be able to customize: min, max, lowestValueInRange, step, subdivision, fix
	export let parameterStore: CustomWritable<number>;
	export let min = 0;
	export let max = 100;
	export let minDegree = 30;
	export let maxDegree = 330;
	export let step = 1;
	export let label = 'Value';
	/**
	 * @default "2"
	 * @description Precision in decimal places.
	 * for output anchors or anchors that have not specified an input/output prop.
	 */
	export let fixed = 0;
	export let fontColor: CSSColorString | null = null;
	export let barColor: CSSColorString | null = null;
	export let bgColor: CSSColorString | null = null;

	$: connected = typeof parameterStore.set !== 'function';

	let graph = getContext<Graph>('graph');
	let node = getContext<Node>('node');

	const groups = graph.groups;
	const selected = $groups.selected;
	const activeGroup = graph.activeGroup;

	$: width = node.dimensions.width;
	$: height = node.dimensions.height;

	let sliderWidth: number; // Width of knob on DOM (relative to scale)
	let sliderElement: HTMLInputElement;
	let sliding = false; // Whether the knob is currently being dragged
	let previousX = 0; // Represents previous cursor position
	let pixelsMoved = 0; // Number of pixels moved during slide
	let rotating = false;

	// Grab cursor from store
	$: cursor = graph.cursor;

	$: if (rotating) {
		calculateRotation(step);
	}

	$: if (sliding) {
		//UPDATE USING CALCULATEROTATION ~~~~~~~~~~~~~~~~~~~~~~
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

	// to be replaced by calculateRotation
	function calculateSlide(
		cursorChange: number,
		increment = step,
		scaler = (1 / (max - min)) * 100
	) {
		if (typeof $parameterStore !== 'number') return;
		const pixelsToMove = ($width * scaler) / ((maxDegree - minDegree) / increment);
		// const wd = sliderElement.getBoundingClientRect().width;
		// console.log(wd, $width);

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

	function calculateRotation(
		cursorChange: number,
		increment = step,
		scaler = (1 / (max - min)) * 100
	) {
		const knobWidth = sliderElement.getBoundingClientRect().width;
		const knobHeight = sliderElement.getBoundingClientRect().height;
		if (typeof $parameterStore !== 'number') return;
		const pixelsToMove = ($width * scaler) / ((maxDegree - minDegree) / increment);
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
		// console.log('NUMBER:', number);
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

	$: knobValue = ((($parameterStore as number) - min) / (max - min)) * (maxDegree - minDegree); //why do we need to cast as number????
	$: indicatorStyle = 'rotate(' + `${knobValue}` + 'deg)';
	$: angle = `rotate(${minDegree + knobValue}deg`;

	function clamp(num: number, min: number, max: number) {
		return Math.min(Math.max(num, min), max);
	}

	function getElementCenter(): [number, number] {
		const { top, left, width, height } = sliderElement.getBoundingClientRect();
		return [left + width / 2, top + height / 2];
	}

	function getAngle(
		[centerX, centerY]: [number, number],
		[left, top]: [number, number],
		from: number,
		range: number
	) {
		const adjacent = left - centerX;
		const opposite = top - centerY;
		const radians = Math.atan(opposite / adjacent) + (adjacent < 0 ? Math.PI : 0) + Math.PI / 2;
		let angle = radians * (180 / Math.PI); // Convert angle to degrees

		// Normalize the angle to start at 'from', so that the full circle starts
		// and ends at that point.
		angle = angle - from + (angle >= 0 && angle < from ? 360 : 0);

		// When the angle is outside of the given range, we want the angle to go either to the
		// start of the range or to the end of the range, based on proximity to either end.
		if (angle > 180 + range / 2) {
			angle = 0;
		}

		return clamp(angle, 0, range);
	}

	onMount(() => {
		// Access the DOM element and bind the drag event
		// const element = document.querySelector('.radial-slider');
		sliderElement.addEventListener('drag', (event) => {
			setAngle(getAngle(getElementCenter(), [0, 0], 220, 280) + 40);
		});
	});
</script>

{#if !connected}
	<!-- this div is wrapping the knob input section -->
	<div class="wrapper" style:color={fontColor}>
		<div class="knob" bind:offsetWidth={sliderWidth} style:transform={angle}>
			<!-- <label for="knob-input" class="input-label">{label}</label> -->
			<label for="knob-input" class="input-label" />
			<input
				tabindex={0}
				id="knob-input"
				class="knob-input"
				type="text"
				value={$parameterStore.toFixed(fixed)}
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
			<div class="indicator" />
		</div>
		<div class="knob_value">{$parameterStore.toFixed(fixed)}</div>
	</div>
{:else}
	<div class="wrapper connected">
		<div class="knob-input connected" style:--percentage="10%" aria-label={label}>
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

	/* .knob-input {
		border: none;
		border-radius: 50%;
		color: inherit;
		text-align: right;
		width: 100%;
		height: 10rem;
		cursor: ew-resize;
		padding: 0.25rem;
		pointer-events: auto;
		border: 3px solid blue;
	} */

	.knob-input {
		display: flex;
		border-radius: 50%;
		width: 10rem;
		height: 10rem;
		pointer-events: auto;
		cursor: pointer;
		padding: 0.25rem;
		box-shadow: 0 0 2px 1px #c7a472;
		background: repeating-radial-gradient(transparent 0%, rgb(244 235 208 / 15%) 2%, transparent 4%),
			repeating-conic-gradient(
				from 15deg,
				#4d3718 0%,
				#c7a472 5%,
				#4d3718 16%,
				#4d3718 34%,
				#c7a472 45%,
				#4d3718 50%
			);
	}
	.knob-input::after {
		content: '';
		border-radius: 100%;
		width: 90%;
		height: 90%;
		margin: 5%;
		background: repeating-radial-gradient(transparent 0%, rgb(244 235 208 / 15%) 2%, transparent 4%),
			repeating-conic-gradient(
				from 15deg,
				#4d3718 0%,
				#c7a472 5%,
				#4d3718 16%,
				#4d3718 34%,
				#c7a472 45%,
				#4d3718 50%
			);
		box-shadow: inset 0 0 7px 0px #c7a472;
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
	.knob_value {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, 50%);
		font-size: 2em;
		color: white;
		z-index: 100;
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

	/* .knob {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100%;
		pointer-events: auto;
		border: 1px solid purple;
	} */

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
