<script context="module" lang="ts">
	import SelectionBox from '$lib/components/SelectionBox/SelectionBox.svelte';
	import Background from '../Background/Background.svelte';
	import GraphRenderer from '../../renderers/GraphRenderer/GraphRenderer.svelte';
	import Editor from '$lib/components/Editor/Editor.svelte';
	import { connectingFrom } from '$lib/components/Anchor/Anchor.svelte';
	import { onMount, setContext, tick } from 'svelte';
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
</script>

<script lang="ts">
	// defining props that the Graph component expects when it is used, type annotations added
	$props = {
		graph: null,
		width: 0,
		height: 0,
		minimap: false,
		controls: false,
		toggle: false,
		fixedZoom: false,
		pannable: true,
		disableSelection: false,
		ZOOM_INCREMENT: 0.1,
		PAN_INCREMENT: 50,
		PAN_TIME: 250,
		MAX_SCALE: 3,
		MIN_SCALE: 0.2,
		selectionColor: null,
		backgroundExists: false,
		fitView: false,
		trackpadPan: false,
		modifier: 'meta',
		theme: 'light',
		title: '',
		drawer: false,
		contrast: false
	};

	$state = {
		animationFrameId: 0,
		initialDistance: 0,
		initialScale: 1,
		anchor: { x: 0, y: 0, top: 0, left: 0 },
		selecting: false,
		creating: false,
		adding: false,
		isMovable: false,
		pinching: false,
		initialFit: false,
		graphDimensions: null,
		toggleComponent: null,
		minimapComponent: null,
		controlsComponent: null,
		drawerComponent: null,
		contrastComponent: null
	};

	// creates a dispatch function using Svelte's createEventDispatcher. This function is used to dispatch custom events from the component. For example, if the component needs to notify parent components of certain actions or changes, dispatch can be used to emit these events.
	const dispatch = (eventName, detail) => {
		const event = new CustomEvent(eventName, { detail });
		dispatchEvent(event);
	};
	// declares a variable activeIntervals with an initial empty object. This is likely used to keep track of active intervals (created with setInterval) that might be used in the component, allowing for better management and clearance of these intervals.
	const activeIntervals: ActiveIntervals = {};

	// creates a Svelte writable store named duplicate. This store probably holds a boolean value to track whether some duplication functionality is active or not.
	const duplicate = writable(false);
	// another writable store, which seems to be used to track if the component has mounted or to count certain actions after mounting.
	const mounted = writable(0);
	// is a writable store to hold a reference to the graph's DOM element. This is useful for direct DOM manipulations or access.
	const graphDOMElement: Writable<HTMLElement | null> = writable(null);

	// External stores
	// These are Svelte stores that are likely passed as part of the graph prop or accessed directly from it. They represent various aspects of the graph's state, such as its current cursor position, scale, dimensions, and more
	const cursor = $props.graph.cursor;
	const scale = $props.graph.transforms.scale;
	const dimensionsStore = $props.graph.dimensions;
	const translation = $props.graph.transforms.translation;
	const groups = $props.graph.groups;
	const groupBoxes = $props.graph.groupBoxes;
	const selected = $groups.selected.nodes;
	const activeGroup = $props.graph.activeGroup;
	const initialNodePositions = $props.graph.initialNodePositions;
	const editing = $props.graph.editing;
	const nodeBounds = $props.graph.bounds.nodeBounds;

	// Subscriptions
	// This is a Svelte reactive statement, denoted by $:. It creates a reactivity relationship between dimensions and dimensionsStore.
	$derived dimensions = $dimensionsStore;

	// Update the svelvet-theme attribute everytime the theme changes
	$effect(() => {
		if ($props.theme) document.documentElement.setAttribute('svelvet-theme', $props.theme);
	});
	// camera view adjustment
	$effect(() => {
		if (!$state.initialFit && $props.fitView) {
			fitIntoView();
		}
	});
	// load the theme toggle
	$effect(() => {
		if ($props.toggle && !$state.toggleComponent) loadToggle();
	});
	// load the minimap
	$effect(() => {
		if ($props.minimap && !$state.minimapComponent) loadMinimap();
	});
	// load the controls interface
	$effect(() => {
		if ($props.controls && !$state.controlsComponent) loadControls();
	});
	// load the drawer
	$effect(() => {
		if ($props.drawer && !$state.drawerComponent) loadDrawer();
	});
	//load the contrast options
	$effect(() => {
		if ($props.contrast && !$state.contrastComponent) loadContrast();
	});

	// This is a temporary workaround for generating an edge where one of the anchors is the cursor
	const cursorAnchor: CursorAnchor = {
		id: null,
		position: $props.graph.cursor,
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
			position: $props.graph.cursor,
			dimensions: { width: writable(0), height: writable(0) }
		}
	};

	// This is an experiment to see if there's a benefit
	// to selectively splitting up the contexts into smaller pieces
	setContext('graphDOMElement', graphDOMElement);
	setContext('cursorAnchor', cursorAnchor);
	setContext('duplicate', duplicate);
	setContext('graph', $props.graph);
	setContext('transforms', $props.graph.transforms);
	setContext('dimensions', $props.graph.dimensions);
	setContext('locked', $props.graph.locked);
	setContext('groups', $props.graph.groups);
	setContext('bounds', $props.graph.bounds);
	setContext('edgeStore', $props.graph.edges);
	setContext('nodeStore', $props.graph.nodes);
	setContext('mounted', mounted);

	// Lifecycle methods
	onMount(() => {
		updateGraphDimensions();
	});

	async function fitIntoView() {
		await tick();
		tracking.set(true);
		const { x, y, scale } = calculateFitView($state.graphDimensions, $nodeBounds);
		if (x !== null && y !== null && scale !== null) {
			$props.graph.transforms.scale.set(scale);
			translation.set({ x, y });
		}
		tracking.set(false);
		$state.initialFit = true;
	}
	async function loadMinimap() {
		$state.minimapComponent = (await import('$lib/components/Minimap/Minimap.svelte')).default;
	}

	async function loadToggle() {
		$state.toggleComponent = (await import('$lib/components/ThemeToggle/ThemeToggle.svelte')).default;
	}

	async function loadControls() {
		$state.controlsComponent = (await import('$lib/components/Controls/Controls.svelte')).default;
	}

	async function loadDrawer() {
		$state.drawerComponent = (await import('$lib/components/Drawer/DrawerController.svelte')).default;
	}

	async function loadContrast() {
		$state.contrastComponent = (await import('$lib/components/ContrastTheme/ContrastTheme.svelte'))
			.default;
	}

	function updateGraphDimensions() {
		if (! $graphDOMElement) return;
		const DOMRect = $graphDOMElement.getBoundingClientRect();
		$state.graphDimensions = {
			top: DOMRect.top,
			left: DOMRect.left,
			bottom: DOMRect.bottom,
			right: DOMRect.right,
			width: DOMRect.width,
			height: DOMRect.height
		};

		$props.graph.dimensions.set($state.graphDimensions);
		if ($props.fitView === 'resize') fitIntoView();
	}

	function onMouseUp(e: MouseEvent | TouchEvent) {
		if ($state.creating) {
			const groupName = generateKey();
			const groupKey: GroupKey = `${groupName}/${$props.graph.id}`;
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

			$state.creating = false;
			$state.selecting = false;
		}

		// Set moving boolean on active group to false
		if ($activeGroup) {
			const nodeGroupArray = Array.from(get($groups[$activeGroup].nodes));
			nodeGroupArray.forEach((node) => node.moving.set(false));
		}
		const cursorEdge = $props.graph.edges.get('cursor');

		if (cursorEdge) {
			$props.graph.edges.delete('cursor');
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
		$state.selecting = false;
		$state.isMovable = false;
		$tracking = false;

		if (!e.shiftKey) {
			connectingFrom.set(null);
		}

		$state.anchor.y = 0;
		$state.anchor.x = 0;
	}

	function onMouseDown(e: MouseEvent) {
		if (!$props.pannable && !(e.shiftKey || e.metaKey)) return;
		if (e.button === 2) return;
		if ($graphDOMElement) $graphDOMElement.focus();

		const { clientX, clientY } = e;

		$initialClickPosition = get(cursor);

		if (e.shiftKey || e.metaKey) {
			e.preventDefault();
			$state.selecting = true;
			const { top, left } = $state.dimensions;
			$state.anchor.y = clientY - top;
			$state.anchor.x = clientX - left;
			$state.anchor.top = top;
			$state.anchor.left = left;
			if (e.shiftKey && e.metaKey) {
				$state.creating = true;
			} else {
				$state.creating = false;
			}

			if (e.metaKey && !e.shiftKey) {
				$state.adding = true;
			} else {
				$state.adding = false;
			}
		} else {
			$state.isMovable = true;
			$selected = new Set();
			$selected = $selected;
		}
	}

	function onTouchStart(e: TouchEvent) {
		$selected = new Set();
		$selected = $selected;

		$initialClickPosition = get(cursor);

		$state.isMovable = true;
		if (e.touches.length === 2) {
			startPinching();
			$state.initialDistance = $touchDistance;
			$state.initialScale = $scale;
		}
	}

	function onTouchEnd() {
		$state.isMovable = false;
		$state.pinching = false;
	}

	function startPinching() {
		if (!$state.pinching) {
			$state.pinching = true;
			$state.animationFrameId = requestAnimationFrame(handlePinch);
		}
	}

	function handlePinch() {
		if (!$state.pinching) {
			cancelAnimationFrame($state.animationFrameId);
			return;
		}

		const newDistance = $touchDistance;
		const scaleFactor = newDistance / $state.initialDistance;
		$scale = $state.initialScale * scaleFactor;
		$state.animationFrameId = requestAnimationFrame(handlePinch);
	}

	function handleKeyDown(e: KeyboardEvent) {
		const { key, code } = e;
		const target = e.target as HTMLElement;

		// We dont want to prevent users from interacting with inputs
		if (target.tagName == 'INPUT' || target.tagName == 'TEXTAREA') return;

		if (code === 'KeyA' && e[`${$props.modifier}Key`]) {
			const unlockedNodes = $props.graph.nodes.getAll().filter((node) => !get(node.locked));
			$selected = new Set(unlockedNodes);
		} else if (isArrow(key)) {
			handleArrowKey(key as Arrow, e);
		} else if (key === '=') {
			zoomAndTranslate(-1, $props.graph.dimensions, $props.graph.transforms, $props.ZOOM_INCREMENT);
		} else if (key === '-') {
			zoomAndTranslate(1, $props.graph.dimensions, $props.graph.transforms, $props.ZOOM_INCREMENT);
		} else if (key === '0') {
			fitIntoView();
		} else if (key === 'Control') {
			$groups['selected'].nodes.set(new Set());
		} else if (code === 'KeyD' && e[`${$props.modifier}Key`]) {
			duplicate.set(true);
			setTimeout(() => {
				duplicate.set(false);
			}, 100);
		} else if (key === 'Tab' && (e.altKey || e.ctrlKey)) {
			selectNextNode();
		} else if (key === 'l') {
			$props.theme = $props.theme === 'light' ? 'dark' : 'light';
		} else if (key === 'd') {
			$props.drawer = !$props.drawer;
		} else if (key === 'm') {
			$props.minimap = !$props.minimap;
		} else if (key === 'c') {
			$props.controls = !$props.controls;
		} else if (key === 'e') {
			const node = Array.from($selected)[0];
			$props.graph.editing.set(node);
		} else {
			return; // Unhandled action: used default handler
		}

		e.preventDefault();
	}

	//This function handles selecting nodes
	function selectNextNode() {
		const nodes = $props.graph.nodes.getAll();

		const currentIndex = nodes.findIndex((node) => $selected.has(node));
		const nextIndex = currentIndex + 1;

		$selected.delete(nodes[currentIndex]);
		$selected.add(nodes[nextIndex]);
	}

	function handleKeyUp(e: KeyboardEvent) {
		const { key } = e;

		if (isArrow(key)) {
			clearInterval(activeIntervals[key]);
			delete activeIntervals[key];
		} else if (key === 'Shift') {
			connectingFrom.set(null);
		}
	}

	function handleScroll(e: WheelEvent) {
		if ($props.fixedZoom) return;
		const multiplier = e.shiftKey ? 0.15 : 1;
		const { clientX, clientY, deltaY } = e;
		const currentTranslation = $translation;
		const pointerPosition = { x: clientX, y: clientY };

		// Check if deltaY has decimal places
		// If it does, it means the user is using a trackpad
		// If trackpadPan is enabled or the meta key is pressed
		// Pan the graph instead of zooming
		if (($props.trackpadPan || e.metaKey) && deltaY % 1 === 0) {
			$translation = {
				x: ($translation.x -= e.deltaX),
				y: ($translation.y -= e.deltaY)
			};

			return;
		}

		if (($scale >= $props.MAX_SCALE && deltaY < 0) || ($scale <= $props.MIN_SCALE && deltaY > 0)) return;

		// Calculate the scale adjustment
		const scrollAdjustment = Math.min(0.009 * multiplier * Math.abs(deltaY), 0.08);
		const newScale = calculateZoom($scale, Math.sign(deltaY), scrollAdjustment);

		// Calculate the translation adjustment
		const newTranslation = calculateTranslation(
			$scale,
			newScale,
			currentTranslation,
			pointerPosition,
			$state.graphDimensions
		);

		// Apply transforms
		scale.set(newScale);
		translation.set(newTranslation);
	}

	//handles movement of camera in the canvas and the nodes
	function handleArrowKey(key: Arrow, e: KeyboardEvent) {
		const multiplier = e.shiftKey ? 2 : 1;
		const start = performance.now();
		const direction = key === 'ArrowLeft' || key === 'ArrowUp' ? 1 : -1;
		const leftRight = key === 'ArrowLeft' || key === 'ArrowRight';
		const startOffset = leftRight ? $translation.x : $translation.y;
		const endOffset = startOffset + direction * $props.PAN_INCREMENT * multiplier;

		if (!activeIntervals[key]) {
			let interval = setInterval(() => {
				const time = performance.now() - start;

				//movement of camera when no nodes are selected
				if ($selected.size === 0) {
					const movement = startOffset + (endOffset - startOffset) * (time / $props.PAN_TIME);
					translation.set({
						x: leftRight ? movement : $translation.x,
						y: leftRight ? $translation.y : movement
					});
				} else {
					//movement of nodes when selected
					const delta = {
						x: leftRight ? -direction * 2 : 0,
						y: leftRight ? 0 : -direction * 2
					};
					Array.from($selected).forEach((node) => {
						const currentPosition = get(node.position);
						let groupBox: GroupBox | undefined;
						const groupName = get(node.group);

						const groupBoxes = get($props.graph.groupBoxes);

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
	// // new definitions for Radio Group test
	// let options = ['option 1', 'option 2', 'option 3'];
	// let parameterStore = writable('default value');
</script>

<!-- <button onclick={() => getJSONState(graph)}>SAVE STATE</button> -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->

<section
	role="presentation"
	id={$props.graph.id}
	class="svelvet-wrapper"
	{title}
	style:width={$props.width ? $props.width + 'px' : '100%'}
	style:height={$props.height ? $props.height + 'px' : '100%'}
	style:cursor={$props.pannable ? 'move' : 'default'}
	onwheel|preventDefault={handleScroll}
	onmousedown|preventDefault|self={onMouseDown}
	ontouchend|preventDefault={onMouseUp}
	ontouchstart|preventDefault|self={onTouchStart}
	onkeydown={handleKeyDown}
	onkeyup={handleKeyUp}
	bind:this={$graphDOMElement}
	tabindex={0}
>
	<GraphRenderer {isMovable}>
		{#if $editing}
			<Editor editing={$editing} />
		{/if}
		 {@render $props.children}
	</GraphRenderer>

	{#if $props.backgroundExists}
		{@render $props.background}
	{:else}
		<Background />
	{/if}
	{#if $props.minimap}
		<svelte:component this={$state.minimapComponent} />
	{/if}
	{#if $props.controls}
		<svelte:component this={$state.controlsComponent} />
	{/if}
	{#if $props.toggle}
		<svelte:component this={$state.toggleComponent} />
	{/if}
	{#if $props.drawer}
		<svelte:component this={$state.drawerComponent} />
	{/if}
	{#if $props.contrast}
		<svelte:component this={$state.contrastComponent} />
	{/if}
	{@render $props.minimap}
	{@render $props.drawer}
	{@render $props.controls}
	{@render $props.toggle}
	{@render $props.contrast}
	{#if $state.selecting && !$props.disableSelection}
		<SelectionBox {creating} {anchor} graph={$props.graph} {adding} color={$props.selectionColor} />
	{/if}
</section>

<svelte:window
	ontouchend={onMouseUp}
	onmouseup={onMouseUp}
	onresize={updateGraphDimensions}
	onscroll={updateGraphDimensions}
/>

<style>
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
