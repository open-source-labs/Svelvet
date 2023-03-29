<script lang="ts">
	import { onMount } from 'svelte';
	import { activeKeys } from '$lib/stores';
	import type { Graph, XYPair } from '$lib/types';
	import { isArrow } from '$lib/types';
	import { calculateTranslation, calculateZoom, zoomGraph } from '$lib/utils';
	import SelectionBox from '$lib/components/SelectionBox/SelectionBox.svelte';
	import { cursorPosition, initialClickPosition } from '$lib/stores/CursorStore';
	import { moveNodes } from '$lib/components/Node/util';
	import { get } from 'svelte/store';

	export let graph: Graph;
	export let MAX_SCALE = 3;
	export let MIN_SCALE = 0.2;
	export let ZOOM_INCREMENT = 0.01;
	export let PAN_INCREMENT = 50;
	export let PAN_TIME = 250;
	export let disableSelection = false;

	export let boundary: XYPair;
	export let fixedZoom: boolean = false;

	onMount(() => {
		graphBounds = graphDOMElement.getBoundingClientRect();
	});

	const actions: Record<string, (key: string) => void> = {
		'=': () => zoomGraph(scale, calculateZoom($scale, -10, ZOOM_INCREMENT)),
		'-': () => zoomGraph(scale, calculateZoom($scale, 10, ZOOM_INCREMENT)),
		'0': resetTransforms,
		ArrowLeft: (key) => handleArrowKey(key),
		ArrowRight: (key) => handleArrowKey(key),
		ArrowUp: (key) => handleArrowKey(key),
		ArrowDown: (key) => handleArrowKey(key),
		Control: () => $groups['selected'].set(new Set())
	};

	const scaleBounds = { min: MIN_SCALE, max: MAX_SCALE };
	const { transforms, isLocked, groups, connectingFrom } = graph;
	const { selected } = $groups;
	const { scale, translation } = transforms;
	const { x: translationX, y: translationY } = translation;
	const { x: cursorX, y: cursorY } = cursorPosition;

	let isMovable = false;
	let selecting: boolean = false;
	let graphBounds: DOMRect;
	let anchor = { x: 0, y: 0 };
	let graphDOMElement: HTMLDivElement;
	let interval: number | undefined = undefined;
	interface ActiveIntervals extends Record<string, NodeJS.Timer | undefined> {}
	const activeIntervals: ActiveIntervals = {};

	function handleScroll(e: WheelEvent) {
		if (fixedZoom) return;
		const { clientX, clientY, deltaY } = e;
		const currentTranslation = { x: $translationX, y: $translationY };
		const pointerPosition = { x: clientX, y: clientY };

		if (($scale >= MAX_SCALE && deltaY < 0) || ($scale <= MIN_SCALE && deltaY > 0)) return;

		// Calculate the scale adjustment
		const newScale = calculateZoom($scale, deltaY, ZOOM_INCREMENT);

		// Calculate the translation adjustment
		const newTranslation = calculateTranslation(
			$scale,
			newScale,
			currentTranslation,
			pointerPosition,
			graphBounds
		);

		// Apply transforms
		zoomGraph(scale, newScale);
		translateGraph(newTranslation);
	}

	function translateGraph(translation: { x: number | null; y: number | null }) {
		if (translation.x) $translationX = translation.x;
		if (translation.y) $translationY = translation.y;
	}

	function onMouseDown(e: MouseEvent) {
		$initialClickPosition = { x: $cursorX, y: $cursorY };
		if (!$activeKeys['Shift']) {
			$isLocked = true;
			isMovable = true;
		} else {
			selecting = true;
			anchor.y = e.clientY - graphBounds.top;
			anchor.x = e.clientX - graphBounds.left;
		}
		$selected = new Set();
	}

	function onMouseUp() {
		$isLocked = false;
		selecting = false;
		isMovable = false;
		$connectingFrom = null;
		anchor.y = 0;
		anchor.x = 0;
	}

	function handleArrowKey(key: string) {
		const multiplier = $activeKeys['Shift'] ? 2 : 1;
		const start = performance.now();
		const axis = key === 'ArrowLeft' || key === 'ArrowRight' ? 'x' : 'y';
		const direction = key === 'ArrowLeft' || key === 'ArrowUp' ? 1 : -1;
		const startOffset = axis === 'x' ? $translationX : $translationY;
		const endOffset = startOffset + direction * PAN_INCREMENT * multiplier;

		if (!activeIntervals[key]) {
			let interval = setInterval(() => {
				const time = performance.now() - start;

				if (axis === 'x') {
					const newX = startOffset + (endOffset - startOffset) * (time / PAN_TIME);

					if (get($groups['selected']).size) {
						console.log('moving nodes');
						moveNodes(graph, -newX / 100, 0, $groups['selected']);
					} else {
						translateGraph({ x: newX, y: null });
					}
				} else {
					const newY = startOffset + (endOffset - startOffset) * (time / PAN_TIME);
					if (get($groups['selected']).size) {
						moveNodes(graph, 0, -newY / 100, $groups['selected']);
					} else {
						translateGraph({ x: null, y: newY });
					}
				}
			}, 5);
			activeIntervals[key] = interval;
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		const { key } = e;
		$activeKeys[key] = true;
		actions[key]?.(key);
	}

	function handleKeyUp(e: KeyboardEvent) {
		const { key } = e;
		activeKeys.update((keys) => {
			delete keys[key];
			return keys;
		});

		if (isArrow(key)) {
			clearInterval(activeIntervals[key]);
			delete activeIntervals[key];
		}
		interval = undefined;
	}

	function resetTransforms() {
		$scale = 1;
		$translationY = 0;
		$translationX = 0;
	}

	$: if (isMovable) {
		let newX = $cursorX - $initialClickPosition.x;
		let newY = $cursorY - $initialClickPosition.y;

		$translationX += newX * $scale;
		$translationY += newY * $scale;
	}

	function updateCursorStore(e: MouseEvent) {
		const { clientX, clientY } = e;

		const offsetX = (graphBounds.width * (1 - $scale)) / 2 + $translationX;
		const offsetY = (graphBounds.height * (1 - $scale)) / 2 + $translationY;

		const newX = (clientX - graphBounds.left - offsetX) / $scale;
		const newY = (clientY - graphBounds.top - offsetY) / $scale;

		cursorX.set(newX);
		cursorY.set(newY);
	}

	const throttledOnMouseMove = throttle(updateCursorStore, 10);
	const debouncedHandleScroll = debounce(handleScroll, 10);

	function throttle<T extends unknown[], R>(
		func: (...args: T) => R,
		limit: number
	): (...args: T) => void {
		let lastCall = 0;

		return (...args: T) => {
			const now = new Date().getTime();

			if (now - lastCall >= limit) {
				lastCall = now;
				func(...args);
			}
		};
	}

	function debounce<T extends unknown[], R>(
		func: (...args: T) => R,
		wait: number
	): (...args: T) => void {
		let timeout: ReturnType<typeof setTimeout> | null;

		return (...args: T) => {
			if (timeout) {
				clearTimeout(timeout);
			}

			timeout = setTimeout(() => {
				func(...args);
			}, wait);
		};
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<table
	id={`graph-${graph.id}`}
	class="wrapper"
	tabindex={0}
	role="presentation"
	on:wheel|preventDefault={debouncedHandleScroll}
	on:keydown={handleKeyDown}
	on:keyup={handleKeyUp}
	on:mousedown={onMouseDown}
	bind:this={graphDOMElement}
>
	{#if selecting && !disableSelection}
		<SelectionBox {anchor} {graph} />
	{/if}
	<div
		class="canvas"
		style="transform: translate({$translationX}px, {$translationY}px) scale({$scale});"
	>
		<slot />
	</div>
</table>

<svelte:window on:mouseup={onMouseUp} on:mousemove|preventDefault={throttledOnMouseMove} />

<style>
	.wrapper {
		position: absolute;
		overflow: hidden;
		cursor: move;
		width: 100%;
		height: 100%;
		border-radius: 20px;
	}

	.canvas {
		position: absolute;
		width: 100%;
		height: 100%;
		/* will-change: transform; */
		backface-visibility: hidden;
		/* outline: solid 1px red; */
	}
	.wrapper:focus {
		outline: none;
		box-shadow: 0 0 0 2px blue;
	}
</style>
