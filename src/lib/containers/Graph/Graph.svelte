<script lang="ts">
	import SelectionBox from '$lib/components/SelectionBox/SelectionBox.svelte';
	import Background from '../Background/Background.svelte';
	import GraphRenderer from '../../renderers/GraphRenderer/GraphRenderer.svelte';
	import Editor from '$lib/components/Editor/Editor.svelte';
	import { onMount, setContext, getContext } from 'svelte';
	import type {
		ThemeGroup,
		Graph,
		GroupBox,
		Arrow,
		GroupKey,
		Group,
		GraphDimensions,
		CSSColorString
	} from '$lib/types';
	import { writable } from 'svelte/store';
	import { getJSONState } from '$lib/utils/savers/saveStore';
	import { touchDistance, initialClickPosition, tracking } from '$lib/stores/CursorStore';
	import { isArrow } from '$lib/types';
	import { calculateTranslation, calculateZoom, generateKey, zoomGraph } from '$lib/utils';
	import { activeKeys } from '$lib/stores';
	import { get } from 'svelte/store';
	import { getRandomColor, translateGraph } from '$lib/utils';
	import type { Writable } from 'svelte/store';

	export let graph: Graph;
	export let width: number;
	export let height: number;
	export let snapTo = 1;
	export let minimap = false;
	export let controls = false;
	export let toggle = false;
	export let fixedZoom = false;
	export let disableSelection = false;
	export let ZOOM_INCREMENT = 0.1;
	export let PAN_INCREMENT = 50;
	export let PAN_TIME = 250;
	export let MAX_SCALE = 3;
	export let MIN_SCALE = 0.2;
	export let selectionColor: CSSColorString;
	export let backgroundExists: boolean;

	setContext('snapTo', snapTo);
	setContext<Graph>('graph', graph);
	setContext('theme', graph.theme);
	const themeStore = getContext<Writable<ThemeGroup>>('themeStore');

	let interval: number | undefined = undefined;
	interface ActiveIntervals extends Record<string, NodeJS.Timer | undefined> {}
	const activeIntervals: ActiveIntervals = {};

	let anchor = { x: 0, y: 0, top: 0, left: 0 };
	let selecting: boolean = false;
	let graphBounds: GraphDimensions;
	let graphDOMElement: HTMLElement;
	let isMovable = false;
	let initialDistance: number = 0;

	const cursor = graph.cursor;
	const scale = graph.transforms.scale;
	const groupBoxes = graph.groupBoxes;
	const dimensionsStore = graph.dimensions;
	const groups = graph.groups;
	const selected = $groups.selected.nodes;
	const translation = graph.transforms.translation;
	const translationX = translation.x;
	const translationY = translation.y;
	const activeGroup = graph.activeGroup;
	const initialNodePositions = graph.initialNodePositions;
	const editing = graph.editing;
	const linkingAny = graph.linkingAny;
	const linkingInput = graph.linkingInput;
	const linkingOutput = graph.linkingOutput;

	$: dimensions = $dimensionsStore;
	$: creating = ($activeKeys['Shift'] && $activeKeys['Meta'] === true) === true;
	$: adding = $activeKeys['Meta'] === true && !$activeKeys['Shift'];

	let toggleComponent: ConstructorOfATypedSvelteComponent | null = null;
	let minimapComponent: ConstructorOfATypedSvelteComponent | null = null;
	let controlsComponent: ConstructorOfATypedSvelteComponent | null = null;

	onMount(async () => {
		updateGraphBounds();
	});

	$: if (toggle && !toggleComponent) {
		async function loadToggle() {
			toggleComponent = (await import('$lib/components/ThemeToggle/ThemeToggle.svelte')).default;
		}
		loadToggle();
	}
	$: if (minimap && !minimapComponent) {
		async function loadMinimap() {
			minimapComponent = (await import('$lib/components/Minimap/Minimap.svelte')).default;
		}
		loadMinimap();
	}
	$: if (controls && !controlsComponent) {
		async function loadControls() {
			controlsComponent = (await import('$lib/components/Controls/Controls.svelte')).default;
		}
		loadControls();
	}

	function updateGraphBounds() {
		const DOMRect = graphDOMElement.getBoundingClientRect();
		graphBounds = {
			top: DOMRect.top,
			left: DOMRect.left,
			bottom: DOMRect.bottom,
			right: DOMRect.right,
			width: DOMRect.width,
			height: DOMRect.height
		};
		graph.dimensions.set(graphBounds);
	}

	function onMouseUp() {
		if (creating) {
			const groupName = generateKey();
			const groupKey: GroupKey = `${groupName}/${graph.id}`;

			const width = $cursor.x - $initialClickPosition.x;
			const height = $cursor.y - $initialClickPosition.y;
			const top = Math.min($initialClickPosition.y, $initialClickPosition.y + height);
			const left = Math.min($initialClickPosition.x, $initialClickPosition.x + width);

			const dimensions = {
				width: writable(Math.abs(width)),
				height: writable(Math.abs(height))
			};
			const position = writable({
				x: left,
				y: top
			});

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

		// Set moving boolean on active group to false
		if ($activeGroup) {
			const nodeGroupArray = Array.from(get($groups[$activeGroup].nodes));
			nodeGroupArray.forEach((node) => node.moving.set(false));
		}

		$activeGroup = null;
		$initialClickPosition = { x: 0, y: 0 };
		$initialNodePositions = [];
		graph.edges.delete('cursor');
		selecting = false;
		isMovable = false;
		$tracking = false;
		if ($linkingAny) linkingAny.set(null);
		if ($linkingInput) linkingInput.set(null);
		if ($linkingOutput) linkingOutput.set(null);

		anchor.y = 0;
		anchor.x = 0;
	}

	function onMouseDown(e: MouseEvent) {
		graphDOMElement.focus();

		const { clientX, clientY } = e;

		$initialClickPosition = $cursor;

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

	// This can be refined
	function onTouchStart(e: TouchEvent) {
		$selected = new Set();
		$selected = $selected;

		$initialClickPosition = $cursor;

		isMovable = true;
	}

	function onTouchEnd(e: TouchEvent) {
		isMovable = false;
	}

	// There shouldn't have to be a listener on the element
	function onTouchMove(e: TouchEvent) {
		if (e.touches.length === 2) {
			const newDistance = $touchDistance;
			const scaleFactor = newDistance / initialDistance;

			const newScale = calculateZoom($scale, 12 * (1 - scaleFactor), ZOOM_INCREMENT);
			const currentTranslation = { x: $translationX, y: $translationY };
			// Calculate the translation adjustment
			const newTranslation = calculateTranslation(
				$scale,
				newScale,
				currentTranslation,
				$cursor,
				graphBounds
			);

			// Apply transforms
			translateGraph(translation, newTranslation);
			zoomGraph(scale, newScale);

			// Update the initial distance
			initialDistance = newDistance;
		}
	}

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
		const newScale = calculateZoom($scale, Math.sign(deltaY), ZOOM_INCREMENT);

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
		translateGraph(translation, newTranslation);
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

				translateGraph(translation, {
					x: leftRight ? movement : null,
					y: leftRight ? null : movement
				});
			}, 5);
			activeIntervals[key] = interval;
		}
	}

	function resetTransforms() {
		$scale = 1;
		$translationY = 0;
		$translationX = 0;
	}
</script>

<!-- <button on:click={() => getJSONState(graph)}>SAVE STATE</button> -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<section
	class="svelvet-wrapper"
	title="graph"
	style:width={width ? width + 'px' : '100%'}
	style:height={height ? height + 'px' : '100%'}
	style:color={$themeStore.text || 'black'}
	id={graph.id}
	bind:this={graphDOMElement}
	on:mousedown|preventDefault={onMouseDown}
	on:touchend|preventDefault={onTouchEnd}
	on:touchstart|preventDefault={onTouchStart}
	on:touchmove|self|preventDefault={onTouchMove}
	on:wheel|preventDefault={handleScroll}
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
	{#if backgroundExists}
		<slot name="background" />
	{:else}
		<Background />
	{/if}
	{#if minimap}
		<svelte:component this={minimapComponent} />
	{/if}
	{#if controls}
		<svelte:component this={controlsComponent} />
	{/if}
	{#if toggle}
		<svelte:component this={toggleComponent} />
	{/if}
	<slot name="minimap" />

	<slot name="controls" />
	<slot name="toggle" />
	{#if selecting && !disableSelection}
		<SelectionBox {creating} {anchor} {graph} {adding} color={selectionColor} />
	{/if}
</section>

<svelte:window on:mouseup={onMouseUp} on:resize={updateGraphBounds} />

<style>
	@import url('https://fonts.googleapis.com/css2?family=Rubik&display=swap');

	.svelvet-wrapper {
		position: relative;
		overflow: hidden;
		cursor: move;
		font-family: 'Rubik';
		box-sizing: border-box !important;
		user-select: none;
		margin: 0;
		line-height: 1rem;
		font-size: 0.85rem;
		pointer-events: auto;
	}
	.svelvet-wrapper:focus {
		outline: none;
		box-shadow: 0 0 0 2px rgb(59, 102, 232);
	}

	:root {
		--dark-background: hsl(0, 1%, 21%);
		--light-background: hsl(0, 0%, 93%);
		--node-background-light: hsl(0, 0%, 93%);
		--node-background-dark: hsl(0, 0%, 11%);
		--text-color-dark: hsl(0, 0%, 93%);
		--text-color-light: hsl(0, 0%, 21%);
	}
</style>
