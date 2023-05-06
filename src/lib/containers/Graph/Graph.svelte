<script context="module" lang="ts">
	import SelectionBox from '$lib/components/SelectionBox/SelectionBox.svelte';
	import Background from '../Background/Background.svelte';
	import GraphRenderer from '../../renderers/GraphRenderer/GraphRenderer.svelte';
	import Editor from '$lib/components/Editor/Editor.svelte';
	import { connectingFrom } from '$lib/components/Anchor/Anchor.svelte';
	import { onMount, setContext, createEventDispatcher, tick } from 'svelte';
	import { isArrow } from '$lib/types';
	import { moveElementWithBounds, calculateRelativeBounds } from '$lib/utils/movers';
	import { touchDistance, initialClickPosition, tracking } from '$lib/stores/CursorStore';
	import { calculateFitView, calculateTranslation, calculateZoom, generateKey } from '$lib/utils';
	import { get, writable, readable } from 'svelte/store';
	import { getRandomColor } from '$lib/utils';
	import { moveElement, zoomAndTranslate } from '$lib/utils/movers';
	import type { Writable } from 'svelte/store';
	import type { ComponentType } from 'svelte';
	import type { Graph, GroupBox, GraphDimensions, CSSColorString } from '$lib/types';
	import type { Arrow, GroupKey, Group, CursorAnchor, ActiveIntervals } from '$lib/types';

	let animationFrameId: number;
</script>

<script lang="ts">
	// Props
	export let graph: Graph;
	export let width: number;
	export let height: number;
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
	export let fitView: boolean | 'resize' = false;
	export let trackpadPan: boolean;
	export let modifier: 'alt' | 'ctrl' | 'shift' | 'meta';
	export let theme = 'light';
	export let title: string;

	// Local constants
	const dispatch = createEventDispatcher();
	const activeIntervals: ActiveIntervals = {};

	// Local stores
	const duplicate = writable(false);
	const mounted = writable(0);
	const graphDOMElement: Writable<HTMLElement | null> = writable(null);

	// External stores
	const cursor = graph.cursor;
	const scale = graph.transforms.scale;
	const dimensionsStore = graph.dimensions;
	const translation = graph.transforms.translation;
	const groups = graph.groups;
	const groupBoxes = graph.groupBoxes;
	const selected = $groups.selected.nodes;
	const activeGroup = graph.activeGroup;
	const initialNodePositions = graph.initialNodePositions;
	const editing = graph.editing;
	const nodeBounds = graph.bounds.nodeBounds;

	// Reactive variables
	let initialDistance = 0;
	let initialScale = 1;
	let anchor = { x: 0, y: 0, top: 0, left: 0 };
	let selecting = false;
	let creating = false;
	let adding = false;
	let isMovable = false;
	let pinching = false;
	let initialFit = false;
	let interval: number | undefined = undefined;
	let graphDimensions: GraphDimensions;
	let toggleComponent: ComponentType | null = null;
	let minimapComponent: ComponentType | null = null;
	let controlsComponent: ComponentType | null = null;

	// Subscriptions
	$: dimensions = $dimensionsStore;

	// Update the svelvet-theme attribute everytime the theme changes
	$: if (theme) document.documentElement.setAttribute('svelvet-theme', theme);

	$: if (!initialFit && fitView) {
		fitIntoView();
		initialFit = true;
	}

	$: if (toggle && !toggleComponent) loadToggle();

	$: if (minimap && !minimapComponent) loadMinimap();

	$: if (controls && !controlsComponent) loadControls();

	// This is a temporary workaround for generating an edge where one of the anchors is the cursor
	const cursorAnchor: CursorAnchor = {
		id: null,
		position: graph.cursor,
		offset: writable({ x: 0, y: 0 }),
		connected: writable(new Set()),
		dynamic: writable(false),
		edge: null,
		edgeColor: writable(null),
		direction: writable('self'),
		inputKey: null,
		type: 'output',
		moving: readable(false),
		store: null,
		mounted: writable(true),
		rotation: readable(0),
		node: {
			zIndex: writable(Infinity),
			rotating: writable(false),
			position: graph.cursor,
			dimensions: { width: writable(0), height: writable(0) }
		}
	};

	// This is an experiment to see if there's a benefit
	// to selectively splitting up the contexts into smaller pieces
	setContext('graphDOMElement', graphDOMElement);
	setContext('cursorAnchor', cursorAnchor);
	setContext('duplicate', duplicate);
	setContext('graph', graph);
	setContext('transforms', graph.transforms);
	setContext('dimensions', graph.dimensions);
	setContext('locked', graph.locked);
	setContext('groups', graph.groups);
	setContext('bounds', graph.bounds);
	setContext('edgeStore', graph.edges);
	setContext('nodeStore', graph.nodes);
	setContext('mounted', mounted);

	// Lifecycle methods
	onMount(() => {
		updateGraphDimensions();
	});

	async function fitIntoView() {
		await tick();
		const { x, y, scale } = calculateFitView(graphDimensions, $nodeBounds);
		if (x !== null && y !== null && scale !== null) {
			graph.transforms.scale.set(scale);
			translation.set({ x, y });
		}
	}
	async function loadMinimap() {
		minimapComponent = (await import('$lib/components/Minimap/Minimap.svelte')).default;
	}

	async function loadToggle() {
		toggleComponent = (await import('$lib/components/ThemeToggle/ThemeToggle.svelte')).default;
	}

	async function loadControls() {
		controlsComponent = (await import('$lib/components/Controls/Controls.svelte')).default;
	}

	function updateGraphDimensions() {
		if (!$graphDOMElement) return;
		const DOMRect = $graphDOMElement.getBoundingClientRect();
		graphDimensions = {
			top: DOMRect.top,
			left: DOMRect.left,
			bottom: DOMRect.bottom,
			right: DOMRect.right,
			width: DOMRect.width,
			height: DOMRect.height
		};

		graph.dimensions.set(graphDimensions);
		if (fitView === 'resize') fitIntoView();
	}

	function onMouseUp(e: MouseEvent | TouchEvent) {
		dispatch('edgeDrop', {
			cursor: get(cursor),
			source: {
				node: $connectingFrom?.anchor.node.id.slice(2),
				anchor: $connectingFrom?.anchor.id.split('/')[0].slice(2)
			}
		});
		if (creating) {
			const groupName = generateKey();
			const groupKey: GroupKey = `${groupName}/${graph.id}`;
			const cursorPosition = get(cursor);
			const width = cursorPosition.x - $initialClickPosition.x;
			const height = cursorPosition.y - $initialClickPosition.y;
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
		const cursorEdge = graph.edges.get('cursor');

		if (cursorEdge) {
			graph.edges.delete('cursor');
			if (!cursorEdge.disconnect)
				dispatch('edgeDrop', {
					cursor: get(cursor),
					source: {
						node: $connectingFrom?.anchor.node.id.slice(2),
						anchor: $connectingFrom?.anchor.id.split('/')[0].slice(2)
					}
				});
		}
		$activeGroup = null;
		$initialClickPosition = { x: 0, y: 0 };
		$initialNodePositions = [];
		selecting = false;
		isMovable = false;
		$tracking = false;

		if (!e.shiftKey) {
			connectingFrom.set(null);
		}

		anchor.y = 0;
		anchor.x = 0;
	}

	function onMouseDown(e: MouseEvent) {
		if (e.button === 2) return;
		if ($graphDOMElement) $graphDOMElement.focus();

		const { clientX, clientY } = e;

		$initialClickPosition = get(cursor);

		if (e.shiftKey || e.metaKey) {
			e.preventDefault();
			selecting = true;
			const { top, left } = dimensions;
			anchor.y = clientY - top;
			anchor.x = clientX - left;
			anchor.top = top;
			anchor.left = left;
			if (e.shiftKey && e.metaKey) {
				creating = true;
			} else {
				creating = false;
			}

			if (e.metaKey && !e.shiftKey) {
				adding = true;
			} else {
				adding = false;
			}
		} else {
			isMovable = true;
			$selected = new Set();
			$selected = $selected;
		}
	}

	function onTouchStart(e: TouchEvent) {
		$selected = new Set();
		$selected = $selected;

		$initialClickPosition = get(cursor);

		isMovable = true;
		if (e.touches.length === 2) {
			startPinching();
			initialDistance = $touchDistance;
			initialScale = $scale;
		}
	}

	function onTouchEnd() {
		isMovable = false;
		pinching = false;
	}

	function startPinching() {
		if (!pinching) {
			pinching = true;
			animationFrameId = requestAnimationFrame(handlePinch);
		}
	}

	function handlePinch() {
		if (!pinching) {
			cancelAnimationFrame(animationFrameId);
			return;
		}

		const newDistance = $touchDistance;
		const scaleFactor = newDistance / initialDistance;
		$scale = initialScale * scaleFactor;
		animationFrameId = requestAnimationFrame(handlePinch);
	}

	function handleKeyDown(e: KeyboardEvent) {
		const { key, code } = e;
		const target = e.target as HTMLElement;
		// We dont want to prevent users from refreshing the page
		// Or interacting with inputs
		if (code === 'KeyR' && e.metaKey) return;
		if (target.tagName == 'INPUT' || target.tagName == 'TEXTAREA') return;

		//Otherwise we prevent default keydown behavior
		e.preventDefault();

		if (code === 'KeyA' && e[`${modifier}Key`]) {
			const unlockedNodes = graph.nodes.getAll().filter((node) => !get(node.locked));
			$selected = new Set(unlockedNodes);
		} else if (isArrow(key)) {
			handleArrowKey(key as Arrow, e);
		} else if (key === '=') {
			zoomAndTranslate(-1, graph.dimensions, graph.transforms, ZOOM_INCREMENT);
		} else if (key === '-') {
			zoomAndTranslate(1, graph.dimensions, graph.transforms, ZOOM_INCREMENT);
		} else if (key === '0') {
			fitIntoView();
		} else if (key === 'Control') {
			$groups['selected'].nodes.set(new Set());
		} else if (code === 'KeyD' && e[`${modifier}Key`]) {
			duplicate.set(true);
			setTimeout(() => {
				duplicate.set(false);
			}, 100);
		}
	}

	function handleKeyUp(e: KeyboardEvent) {
		const { key } = e;

		if (isArrow(key)) {
			clearInterval(activeIntervals[key]);
			delete activeIntervals[key];
		} else if (key === 'Shift') {
			connectingFrom.set(null);
		}
		interval = undefined;
	}

	function handleScroll(e: WheelEvent) {
		if (fixedZoom) return;
		const multiplier = e.shiftKey ? 0.15 : 1;
		const { clientX, clientY, deltaY } = e;
		const currentTranslation = $translation;
		const pointerPosition = { x: clientX, y: clientY };

		// Check if deltaY has decimal places
		// If it does, it means the user is using a trackpad
		// If trackpadPan is enabled or the meta key is pressed
		// Pan the graph instead of zooming
		if ((trackpadPan || e.metaKey) && deltaY % 1 === 0) {
			$translation = {
				x: ($translation.x -= e.deltaX),
				y: ($translation.y -= e.deltaY)
			};

			return;
		}

		if (($scale >= MAX_SCALE && deltaY < 0) || ($scale <= MIN_SCALE && deltaY > 0)) return;

		// Calculate the scale adjustment
		const scrollAdjustment = Math.min(0.009 * multiplier * Math.abs(deltaY), 0.08);
		const newScale = calculateZoom($scale, Math.sign(deltaY), scrollAdjustment);

		// Calculate the translation adjustment
		const newTranslation = calculateTranslation(
			$scale,
			newScale,
			currentTranslation,
			pointerPosition,
			graphDimensions
		);

		// Apply transforms
		scale.set(newScale);
		translation.set(newTranslation);
	}

	function handleArrowKey(key: Arrow, e: KeyboardEvent) {
		const multiplier = e.shiftKey ? 2 : 1;
		const start = performance.now();
		const direction = key === 'ArrowLeft' || key === 'ArrowUp' ? -1 : 1;
		const leftRight = key === 'ArrowLeft' || key === 'ArrowRight';
		const startOffset = leftRight ? $translation.x : $translation.y;
		const endOffset = startOffset + direction * PAN_INCREMENT * multiplier;

		if (!activeIntervals[key]) {
			let interval = setInterval(() => {
				const time = performance.now() - start;

				if ($selected.size === 0) {
					const movement = startOffset + (endOffset - startOffset) * (time / PAN_TIME);
					translation.set({
						x: leftRight ? movement : $translation.x,
						y: leftRight ? $translation.y : movement
					});
				} else {
					const delta = {
						x: leftRight ? direction * 2 : 0,
						y: leftRight ? 0 : direction * 2
					};
					Array.from($selected).forEach((node) => {
						const currentPosition = get(node.position);
						let groupBox: GroupBox | undefined;
						const groupName = get(node.group);

						const groupBoxes = get(graph.groupBoxes);

						if (groupName) groupBox = groupBoxes.get(groupName);
						if (groupBox) {
							const nodeWidth = get(node.dimensions.width);
							const nodeHeight = get(node.dimensions.height);
							const bounds = calculateRelativeBounds(groupBox, nodeWidth, nodeHeight);
							moveElementWithBounds(currentPosition, delta, node.position, bounds);
						} else {
							moveElement(currentPosition, delta, node.position);
						}
					});
				}
			}, 2);
			activeIntervals[key] = interval;
		}
	}
</script>

<!-- <button on:click={() => getJSONState(graph)}>SAVE STATE</button> -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<section
	id={graph.id}
	class="svelvet-wrapper"
	{title}
	style:width={width ? width + 'px' : '100%'}
	style:height={height ? height + 'px' : '100%'}
	on:wheel|preventDefault={handleScroll}
	on:mousedown|preventDefault|self={onMouseDown}
	on:touchend|preventDefault={onTouchEnd}
	on:touchstart|preventDefault|self={onTouchStart}
	on:keydown={handleKeyDown}
	on:keyup={handleKeyUp}
	bind:this={$graphDOMElement}
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

<svelte:window on:touchend={onMouseUp} on:mouseup={onMouseUp} on:resize={updateGraphDimensions} />

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
		color: var(--default-text-color);
	}
	.svelvet-wrapper:focus {
		outline: none;
		box-shadow: 0 0 0 2px rgb(59, 102, 232);
	}
</style>
