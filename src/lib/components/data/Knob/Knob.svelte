<script lang="ts">
	import { getContext } from 'svelte';
	import { isArrow } from '$lib/types';
	import { roundNum } from '$lib/utils';
	import { tracking } from '$lib/stores/CursorStore';
	import type { Graph, Node, CustomWritable } from '$lib/types';
	import type { CSSColorString } from '$lib/types';
	import { writable } from 'svelte/store';
	import { calculateRelativeCursor } from '$lib/utils';

	// Props
	/**
	 * @default "60"
	 * @description Minimum angle allowed when interacting with the knob rotation.
	 */
	export let minDegree = 60;
	/**
	 * @default "300"
	 * @description Maximum angle allowed when interacting with the knob rotation.
	 */
	export let maxDegree = 300;
	/**
	 * @default
	 * @description
	 */
	export let parameterStore: CustomWritable<number>;
	/**
	 * @default 0
	 * @description Minimum allowable output value
	 */
	export let min = 0;
	/**
	 * @default 100
	 * @description Maximum allowable output value
	 */
	export let max = 100;
	/**
	 * @default 0
	 * @description Minimum allowable output value
	 */
	export let step = 1;
	export let label = 'Value';
	/**
	 * @default "2"
	 * @description Precision in decimal places.
	 */
	export let fixed = 0;
	/**
	 * @default "null"
	 * @description Text color
	 */
	export let fontColor: CSSColorString | null = null;
	/**
	 * @default "lightblue"
	 * @description Knob background color
	 */
	export let knobColor: CSSColorString | null = 'lightblue';
	/**
	 * @default "white"
	 * @description Color
	 */
	export let knobValueColor: CSSColorString | null = 'white';
	export let indicatorColor: CSSColorString | null = '#666565';

	$parameterStore = $parameterStore < min ? min : $parameterStore > max ? max : $parameterStore;
	$: currentDegree = (($parameterStore - min) / (max - min)) * (maxDegree - minDegree) + minDegree;

	$: connected = typeof parameterStore.set !== 'function'; //CHECKED

	let graph = getContext<Graph>('graph');
	let node = getContext<Node>('node');

	const groups = graph.groups;
	const selected = $groups.selected;
	const activeGroup = graph.activeGroup;

	$: width = node.dimensions.width;
	$: height = node.dimensions.height;

	// TODO: need to rename these variables
	let sliderWidth: number; // Width of knob on DOM (relative to scale)
	let knobWrapperElement: HTMLDivElement;
	let knobElement: HTMLDivElement;
	let rotating = false;

	// Grab cursor from store
	$: cursor = graph.cursor;

	//Grab scale/zoom value of graph
	$: scale = graph.transforms.scale;

	$: translation = graph.transforms.translation;

	// when the knob is rotating
	$: if (rotating) {
		calculateNewAngle($cursor.x, $cursor.y); // need to pass these arguments to trigger updates
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
		// ADD SETTIMEOUT FOR SCROLL TO SLOW DOWN KNOB INPUT UPDATES
		currentDegree = roundNum(
			Math.max(minDegree, Math.min(currentDegree + delta * increment, maxDegree)),
			3
		);
	}

	// $: knobValue = ((($parameterStore as number) - min) / (max - min)) * (maxDegree - minDegree); //why do we need to cast as number????
	// $: angle = `rotate(${minDegree + knobValue}deg`;
	$: curAngle = `rotate(${currentDegree}deg`;

	function clamp(num: number): number {
		const increment = ((maxDegree - minDegree) / (max - min)) * step;
		const degreeRoundToStep = Math.round((num - minDegree) / increment) * increment + minDegree;
		const degree = Math.min(Math.max(degreeRoundToStep, minDegree), maxDegree);
		return degree;
	}

	// // get the coordiates of the center of the knob
	// function getElementCenter(): [number, number] {
	// 	const { top, left, width, height } = knobWrapperElement.getBoundingClientRect();
	// 	const e = { clientX: $cursor.x, clientY: $cursor.y };
	// 	//X and Y will be the position relative to the target element
	// 	const { x, y } = calculateRelativeCursor(e, top, left, width, height, $scale, $translation);
	// 	console.log('calculateRelativeCursor result', x, y);
	// 	console.log('scale: ', $scale, 'width:', width, 'height: ', height);
	// 	// console.log('zoom value: ', Graph.ZOOM_INCREMENT);
	// 	// console.log('width,', width, 'height:', height);
	// 	// console.log('left,', left, 'top:', top);
	// 	// console.log('center: ', [left + width / 2, top + height / 2]);

	// 	return [left + width / 2, top + height / 2];
	// }

	// need to pass cursorX and cursorY to trigger updates
	function calculateNewAngle(cursorX: number, cursorY: number): void {
		const { top, left, width, height } = knobWrapperElement.getBoundingClientRect();
		const e = { clientX: cursorX, clientY: cursorY };
		// X and Y are the position relative to the target element's left and top
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
				: currentDegree;
		// caculate the new parameterstore based on clamp(angle)

		$parameterStore = ((clamp(angle) - minDegree) / (maxDegree - minDegree)) * (max - min) + min;
		// return clamp(angle);
		console.log('crr degree', currentDegree);
	}
</script>

{#if !connected}
	<!-- this div is wrapping the knob section -->
	<div class="wrapper" style:color={fontColor} bind:this={knobWrapperElement}>
		<div class="knob-container" bind:offsetWidth={sliderWidth} style:transform={curAngle}>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<div
				tabindex={0}
				id="knob"
				class="knob"
				aria-label="knob component"
				style:background={knobColor}
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
			<div class="indicator" style:background={indicatorColor} />
		</div>
		<div class="knob-value" style:color={knobValueColor}>
			{$parameterStore.toFixed(fixed)}
		</div>
	</div>
{:else}
	<div class="wrapper connected">
		<div class="knob connected" style:--percentage="10%" aria-label={label}>
			<p>{label}</p>
			<p>{currentDegree}</p>
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
		/* cursor: ew-resize; */
		/* border: 1px solid gold; */
	}

	.knob-container {
		/* border: 1px solid red; */
	}

	.knob {
		display: flex;
		border-radius: 50%;
		width: 7rem;
		height: 7rem;
		pointer-events: auto;
		cursor: pointer;
		padding: 0.25rem;
		/* background-color: lightblue; */
		/* border: 1px solid purple; */
	}

	.indicator {
		top: 80%;
		left: 48%;
		transform-origin: 50% -50%;
		position: absolute;
		/* transform: ro÷tate(30 deg); */
		width: 4%;
		height: 15%;
		background-color: #666565;
		/* box-shadow: 0 0 2px white; */
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
