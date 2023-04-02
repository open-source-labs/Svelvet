<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import type { GraphKey, BackgroundStyles, Graph, NodeConfig, XYPair, GroupBox } from '$lib/types';
	import { get, writable } from 'svelte/store';
	import SelectionBox from '$lib/components/SelectionBox/SelectionBox.svelte';
	import Minimap from '$lib/components/Minimap/Minimap.svelte';
	import Controls from '$lib/components/Controls/Controls.svelte';
	import Background from '../Background/Background.svelte';
	import GraphRenderer from '../GraphRenderer/GraphRenderer.svelte';
	import { initialClickPosition } from '$lib/stores/CursorStore';
	import { isArrow } from '$lib/types';
	import { calculateTranslation, calculateZoom, zoomGraph } from '$lib/utils';
	import { getContext } from 'svelte';
	import { activeKeys } from '$lib/stores';
	import { getRandomColor, debounce, moveNodes } from '$lib/utils';

	export let graph: Graph;
	export let mermaid = '';
	export let width: number = 100;
	export let height: number = 100;
	export let graphId: GraphKey;
	export let style: BackgroundStyles = 'dots';
	export let nodes: Array<NodeConfig> = [];
	export let edges: Array<object> = [];
	export let snapTo = 1;
	export let initialZoom = 1;
	export let minimap = false;
	export let controls = false;
	export let boundary: XYPair = { x: Infinity, y: Infinity };
	export let fixedZoom = false;
	export let disableSelection = false;
	export let ZOOM_INCREMENT = 0.01;
	export let PAN_INCREMENT = 50;
	export let PAN_TIME = 250;
	export let MAX_SCALE = 3;
	export let MIN_SCALE = 0.2;

	setContext('snapTo', snapTo);
	setContext<Graph>('graph', graph);
	const theme = getContext<Theme>('theme');

	$: minimapComponent = minimap ? Minimap : null;
	$: controlsComponent = controls ? Controls : null;

	let interval: number | undefined = undefined;
	interface ActiveIntervals extends Record<string, NodeJS.Timer | undefined> {}
	const activeIntervals: ActiveIntervals = {};

	let anchor = { x: 0, y: 0 };
	let selecting: boolean = false;
	let graphBounds: DOMRect;
	let graphDOMElement: HTMLElement;
	let isMovable = false;

	const { dimensions: dimensionsStore } = graph;

	$: cursor = graph.cursor;
	$: scale = graph.transforms.scale;
	$: groupBoxes = graph.groupBoxes;
	$: groups = graph.groups;
	$: dimensions = $dimensionsStore;
	$: selected = $groups.selected.nodes;
	$: translationX = graph.transforms.translation.x;
	$: translationY = graph.transforms.translation.y;
	$: connectingFrom = graph.connectingFrom;
	$: activeGroup = graph.activeGroup;
	$: initialNodePositions = graph.initialNodePositions;

	onMount(() => {
		updateGraphBounds();
	});

	function updateGraphBounds() {
		graphBounds = graphDOMElement.getBoundingClientRect();
		graph.dimensions.set(graphBounds);
	}

	function onMouseUp() {
		if (creating) {
			const groupName = Math.random().toString(36).substring(7);

			let width = $cursor.x - $initialClickPosition.x;
			let height = $cursor.y - $initialClickPosition.y;
			let top = Math.min($initialClickPosition.y, $initialClickPosition.y + height);
			let left = Math.min($initialClickPosition.x, $initialClickPosition.x + width);

			let dimensions = {
				width: writable(Math.abs(width)),
				height: writable(Math.abs(height))
			};
			let position = {
				x: writable(left),
				y: writable(top)
			};

			const groupBox: GroupBox = {
				id: groupName,
				dimensions,
				position,
				color: writable(getRandomColor())
			};

			groupBoxes.add(groupBox);

			Array.from($selected).forEach((node) => {
				node.group.set(groupName);
			});

			groups.update((groups) => {
				const newGroup = {
					id: groupName,
					parent: writable(groupBox),
					nodes: writable(new Set([...$selected, groupBox]))
				};
				groups[groupName] = newGroup;
				return groups;
			});

			$selected = new Set();

			creating = false;
			selecting = false;
		}
		$activeGroup = null;
		$initialClickPosition = { x: 0, y: 0 };
		$initialNodePositions = [];
		selecting = false;
		isMovable = false;
		$connectingFrom = null;
		anchor.y = 0;
		anchor.x = 0;
	}

	function onMouseDown(e: MouseEvent) {
		const { clientX, clientY } = e;
		$initialClickPosition = { x: $cursor.x, y: $cursor.y };
		if ($activeKeys['Shift'] || $activeKeys['Meta']) {
			e.preventDefault();
			selecting = true;
			const { top, left } = dimensions;
			anchor.y = clientY - top;
			anchor.x = clientX - left;
		} else {
			isMovable = true;
			$selected = new Set();
			$selected = $selected;
		}
	}

	const debouncedHandleScroll = debounce(handleScroll, 10);

	function handleKeyDown(e: KeyboardEvent) {
		const { key } = e;
		$activeKeys[key] = true;
		actions[isArrow(key) ? 'Arrow' : key]?.(key);
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

	const actions: Record<string, (key: string) => void> = {
		'=': () => zoomGraph(scale, calculateZoom($scale, -10, ZOOM_INCREMENT)),
		'-': () => zoomGraph(scale, calculateZoom($scale, 10, ZOOM_INCREMENT)),
		'0': resetTransforms,
		Arrow: (key) => handleArrowKey(key),
		Control: () => $groups['selected'].nodes.set(new Set())
	};

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

					if (get($groups.selected.nodes).size) {
						moveNodes(graph, -newX / 100, 0, $groups['selected']);
					} else {
						translateGraph({ x: newX, y: null });
					}
				} else {
					const newY = startOffset + (endOffset - startOffset) * (time / PAN_TIME);
					if (get($groups.selected.nodes).size) {
						moveNodes(graph, 0, -newY / 100, $groups['selected']);
					} else {
						translateGraph({ x: null, y: newY });
					}
				}
			}, 5);
			activeIntervals[key] = interval;
		}
	}

	function resetTransforms() {
		$scale = 1;
		$translationY = 0;
		$translationX = 0;
	}

	$: creating = ($activeKeys['Shift'] && $activeKeys['Meta'] === true) === true;
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<section
	class="svelvet-wrapper"
	title="graph"
	id={graph.id}
	bind:this={graphDOMElement}
	on:mousedown={onMouseDown}
	on:wheel|preventDefault={debouncedHandleScroll}
	on:keydown={handleKeyDown}
	on:keyup={handleKeyUp}
	tabindex={0}
>
	<GraphRenderer {theme} {isMovable} />
	<Background --background-color="var(--{theme}-background)" {style} />
	<slot />
	<svelte:component this={minimapComponent} />
	<svelte:component this={controlsComponent} />
	{#if selecting && !disableSelection}
		<SelectionBox {creating} {anchor} {graph} adding={$activeKeys['Meta'] === true} />
	{/if}
</section>

<svelte:window on:mouseup={onMouseUp} on:resize={updateGraphBounds} />

<style>
	@import url('./styles.css');
</style>
