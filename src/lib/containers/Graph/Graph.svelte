<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import type {
		Theme,
		BackgroundStyles,
		Graph,
		GroupBox,
		Arrow,
		GroupKey,
		Group
	} from '$lib/types';
	import { writable } from 'svelte/store';
	import SelectionBox from '$lib/components/SelectionBox/SelectionBox.svelte';
	import Minimap from '$lib/components/Minimap/Minimap.svelte';
	import Controls from '$lib/components/Controls/Controls.svelte';
	import Background from '../Background/Background.svelte';
	import GraphRenderer from '../../renderers/GraphRenderer/GraphRenderer.svelte';
	import Editor from '$lib/components/Editor/Editor.svelte';
	import { initialClickPosition } from '$lib/stores/CursorStore';
	import { isArrow } from '$lib/types';
	import { calculateTranslation, calculateZoom, generateKey, zoomGraph } from '$lib/utils';
	import { getContext } from 'svelte';
	import { activeKeys } from '$lib/stores';
	import { getRandomColor, debounce, moveNodes } from '$lib/utils';

	export let graph: Graph;
	export let width: number;
	export let height: number;
	export let style: BackgroundStyles = 'dots';
	export let snapTo = 1;
	export let minimap = false;
	export let controls = false;
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

	let anchor = { x: 0, y: 0, top: 0, left: 0 };
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
	$: activeGroup = graph.activeGroup;
	$: initialNodePositions = graph.initialNodePositions;
	$: editing = graph.editing;
	$: linkingAny = graph.linkingAny;
	$: linkingInput = graph.linkingInput;
	$: linkingOutput = graph.linkingOutput;

	onMount(() => {
		updateGraphBounds();
	});

	function updateGraphBounds() {
		graphBounds = graphDOMElement.getBoundingClientRect();
		graph.dimensions.set(graphBounds);
	}

	function onMouseUp() {
		if (creating) {
			const groupName = generateKey();
			const groupKey: GroupKey = `${groupName}/${graph.id}`;

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
				group: writable(groupKey),
				dimensions,
				position,
				color: writable(getRandomColor()),
				moving: writable(false)
			};

			groupBoxes.add(groupBox, groupKey);

			Array.from($selected).forEach((node) => {
				node.group.set(groupKey);
			});

			groups.update((groups) => {
				const newGroup: Group = {
					parent: writable(groupBox),
					nodes: writable(new Set([...$selected, groupBox]))
				};
				groups[groupKey] = newGroup;
				return groups;
			});

			$selected = new Set();

			creating = false;
			selecting = false;
		}
		if ($activeGroup)
			$groups[$activeGroup].nodes.subscribe((nodes) =>
				Array.from(nodes).forEach((node) => node.moving.set(false))
			);

		$activeGroup = null;
		$initialClickPosition = { x: 0, y: 0 };
		$initialNodePositions = [];
		graph.edges.delete('cursor');
		selecting = false;
		isMovable = false;

		if ($linkingAny) linkingAny.set(null);
		if ($linkingInput) linkingInput.set(null);
		if ($linkingOutput) linkingOutput.set(null);

		anchor.y = 0;
		anchor.x = 0;
	}

	function onMouseDown(e: MouseEvent) {
		graphDOMElement.focus();
		const { clientX, clientY } = e;
		$initialClickPosition = { x: $cursor.x, y: $cursor.y };
		if ($activeKeys['Shift'] || $activeKeys['Meta']) {
			e.preventDefault();
			selecting = true;
			const { top, left } = dimensions;
			anchor.y = clientY - top;
			anchor.x = clientX - left;
			anchor.top = top;
			anchor.left = left;
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

		triggerActionBasedOn[key]?.(key);
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

	const triggerActionBasedOn: Record<string, (key: string) => void> = {
		'=': () => zoomGraph(scale, calculateZoom($scale, -10, ZOOM_INCREMENT)),
		'-': () => zoomGraph(scale, calculateZoom($scale, 10, ZOOM_INCREMENT)),
		'0': resetTransforms,
		ArrowLeft: (key) => handleArrowKey(key as Arrow),
		ArrowRight: (key) => handleArrowKey(key as Arrow),
		ArrowUp: (key) => handleArrowKey(key as Arrow),
		ArrowDown: (key) => handleArrowKey(key as Arrow),
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
	function handleArrowKey(key: Arrow) {
		const multiplier = $activeKeys['Shift'] ? 2 : 1;
		const start = performance.now();
		const direction = key === 'ArrowLeft' || key === 'ArrowUp' ? -1 : 1;
		const leftRight = key === 'ArrowLeft' || key === 'ArrowRight';
		const startOffset = leftRight ? $translationX : $translationY;
		const endOffset = startOffset + direction * PAN_INCREMENT * multiplier;

		if (!activeIntervals[key]) {
			let interval = setInterval(() => {
				const time = performance.now() - start;
				const movement = startOffset + (endOffset - startOffset) * (time / PAN_TIME);

				translateGraph({ x: leftRight ? movement : null, y: leftRight ? null : movement });
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
	$: adding = $activeKeys['Meta'] === true && !$activeKeys['Shift'];
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<section
	class="svelvet-wrapper"
	title="graph"
	style:width={width ? width + 'px' : '100%'}
	style:height={height ? height + 'px' : '100%'}
	id={graph.id}
	bind:this={graphDOMElement}
	on:mousedown|preventDefault={onMouseDown}
	on:wheel|preventDefault={debouncedHandleScroll}
	on:keydown|preventDefault={handleKeyDown}
	on:keyup={handleKeyUp}
	tabindex={0}
>
	<GraphRenderer {isMovable}>
		{#if $editing}
			<Editor editing={$editing} />
		{/if}
		<slot />
	</GraphRenderer>
	<Background --background-color="var(--{theme}-background)" {style} />
	<svelte:component this={minimapComponent} />
	<svelte:component this={controlsComponent} />
	{#if selecting && !disableSelection}
		<SelectionBox {creating} {anchor} {graph} {adding} />
	{/if}
</section>

<svelte:window on:mouseup={onMouseUp} on:resize={updateGraphBounds} />

<style>
	@import url('./styles.css');
</style>
