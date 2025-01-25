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
	export let graph: Graph;
	export let width: number = 0;
	export let height: number = 0;
	export let minimap: boolean = false;
	export let controls: boolean = false;
	export let toggle: boolean = false;
	export let fixedZoom: boolean = false;
	export let pannable: boolean = true;
	export let disableSelection: boolean = false;
	export let ZOOM_INCREMENT: number = 0.1;
	export let PAN_INCREMENT: number = 50;
	export let PAN_TIME: number = 250;
	export let MAX_SCALE: number = 3;
	export let MIN_SCALE: number = 0.2;
	export let selectionColor: CSSColorString | null = null;
	export let backgroundExists: boolean = false;
	export let fitView: boolean = false;
	export let trackpadPan: boolean = false;
	export let modifier: string = 'meta';
	export let theme: string = 'light';
	export let title: string = '';
	export let drawer: boolean = false;
	export let contrast: boolean = false;

	let animationFrameId: number = 0;
	let initialDistance: number = 0;
	let initialScale: number = 1;
	let anchor = { x: 0, y: 0, top: 0, left: 0 };
	let selecting: boolean = false;
	let creating: boolean = false;
	let adding: boolean = false;
	let isMovable: boolean = false;
	let pinching: boolean = false;
	let initialFit: boolean = false;
	let graphDimensions: GraphDimensions | null = null;
	let toggleComponent: ComponentType | null = null;
	let minimapComponent: ComponentType | null = null;
	let controlsComponent: ComponentType | null = null;
	let drawerComponent: ComponentType | null = null;
	let contrastComponent: ComponentType | null = null;

	const dispatch = (eventName, detail) => {
		const event = new CustomEvent(eventName, { detail });
		dispatchEvent(event);
	};

	const activeIntervals: ActiveIntervals = {};

	const duplicate = writable(false);
	const mounted = writable(0);
	const graphDOMElement: Writable<HTMLElement | null> = writable(null);

	const cursor = graph.cursor;
	const scale = graph.transforms.scale;
	const dimensionsStore = graph.dimensions;
	const translation = graph.transforms.translation;
	const groups = graph.groups;
	const groupBoxes = graph.groupBoxes;
	const selected = groups.selected.nodes;
	const activeGroup = graph.activeGroup;
	const initialNodePositions = graph.initialNodePositions;
	const editing = graph.editing;
	const nodeBounds = graph.bounds.nodeBounds;

	$: dimensions = dimensionsStore;

	$: {
		if (theme) document.documentElement.setAttribute('svelvet-theme', theme);
	}

	$: {
		if (!initialFit && fitView) {
			fitIntoView();
		}
	}

	$: {
		if (toggle && !toggleComponent) loadToggle();
	}

	$: {
		if (minimap && !minimapComponent) loadMinimap();
	}

	$: {
		if (controls && !controlsComponent) loadControls();
	}

	$: {
		if (drawer && !drawerComponent) loadDrawer();
	}

	$: {
		if (contrast && !contrastComponent) loadContrast();
	}

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

	onMount(() => {
		updateGraphDimensions();
	});

	async function fitIntoView() {
		await tick();
		tracking.set(true);
		const { x, y, scale } = calculateFitView(graphDimensions, nodeBounds);
		if (x !== null && y !== null && scale !== null) {
			graph.transforms.scale.set(scale);
			translation.set({ x, y });
		}
		tracking.set(false);
		initialFit = true;
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

	async function loadDrawer() {
		drawerComponent = (await import('$lib/components/Drawer/DrawerController.svelte')).default;
	}

	async function loadContrast() {
		contrastComponent = (await import('$lib/components/ContrastTheme/ContrastTheme.svelte')).default;
	}

	function updateGraphDimensions() {
		if (!graphDOMElement) return;
		const DOMRect = graphDOMElement.getBoundingClientRect();
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
		try {
			if (creating) {
				const groupName = generateKey();
				const groupKey: GroupKey = `${groupName}/${graph.id}`;
				const cursorPosition = get(cursor);
				const width = cursorPosition.x - initialClickPosition.x;
				const height = cursorPosition.y - initialClickPosition.y;
				const top = Math.min(initialClickPosition.y, initialClickPosition.y + height);
				const left = Math.min(initialClickPosition.x, initialClickPosition.x + width);

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

				Array.from(selected).forEach((node) => {
					node.group.set(groupKey);
				});

				groups.update((groups) => {
					const newGroup: Group = {
						parent: writable(groupBox),
						nodes: writable(new Set([...selected, groupBox]))
					};
					groups[groupKey] = newGroup;
					return groups;
				});

				selected = new Set();

				creating = false;
				selecting = false;
			}

			if (activeGroup) {
				const nodeGroupArray = Array.from(get(groups[activeGroup].nodes));
				nodeGroupArray.forEach((node) => node.moving.set(false));
			}
			const cursorEdge = graph.edges.get('cursor');

			if (cursorEdge) {
				graph.edges.delete('cursor');
				if (!cursorEdge.disconnect)
					dispatch('edgeDrop', {
						cursor: get(cursor),
						source: {
							node: connectingFrom?.anchor.node.id.slice(2),
							anchor: connectingFrom?.anchor.id.split('/')[0].slice(2)
						}
					});
			}
			activeGroup = null;
			initialClickPosition = { x: 0, y: 0 };
			initialNodePositions = [];
			selecting = false;
			isMovable = false;
			tracking = false;

			if (!e.shiftKey) {
				connectingFrom.set(null);
			}

			anchor.y = 0;
			anchor.x = 0;
		} catch (error) {
			console.error('Error handling mouse up event:', error);
		}
	}

	function onMouseDown(e: MouseEvent) {
		try {
			if (!pannable && !(e.shiftKey || e.metaKey)) return;
			if (e.button === 2) return;
			if (graphDOMElement) graphDOMElement.focus();

			const { clientX, clientY } = e;

			initialClickPosition = get(cursor);

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
				selected = new Set();
				selected = selected;
			}
		} catch (error) {
			console.error('Error handling mouse down event:', error);
		}
	}

	function onTouchStart(e: TouchEvent) {
		try {
			selected = new Set();
			selected = selected;

			initialClickPosition = get(cursor);

			isMovable = true;
			if (e.touches.length === 2) {
				startPinching();
				initialDistance = touchDistance;
				initialScale = scale;
			}
		} catch (error) {
			console.error('Error handling touch start event:', error);
		}
	}

	function onTouchEnd() {
		try {
			isMovable = false;
			pinching = false;
		} catch (error) {
			console.error('Error handling touch end event:', error);
		}
	}

	function startPinching() {
		try {
			if (!pinching) {
				pinching = true;
				animationFrameId = requestAnimationFrame(handlePinch);
			}
		} catch (error) {
			console.error('Error starting pinch:', error);
		}
	}

	function handlePinch() {
		try {
			if (!pinching) {
				cancelAnimationFrame(animationFrameId);
				return;
			}

			const newDistance = touchDistance;
			const scaleFactor = newDistance / initialDistance;
			scale = initialScale * scaleFactor;
			animationFrameId = requestAnimationFrame(handlePinch);
		} catch (error) {
			console.error('Error handling pinch:', error);
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		try {
			const { key, code } = e;
			const target = e.target as HTMLElement;

			if (target.tagName == 'INPUT' || target.tagName == 'TEXTAREA') return;

			if (code === 'KeyA' && e[`${modifier}Key`]) {
				const unlockedNodes = graph.nodes.getAll().filter((node) => !get(node.locked));
				selected = new Set(unlockedNodes);
			} else if (isArrow(key)) {
				handleArrowKey(key as Arrow, e);
			} else if (key === '=') {
				zoomAndTranslate(-1, graph.dimensions, graph.transforms, ZOOM_INCREMENT);
			} else if (key === '-') {
				zoomAndTranslate(1, graph.dimensions, graph.transforms, ZOOM_INCREMENT);
			} else if (key === '0') {
				fitIntoView();
			} else if (key === 'Control') {
				groups['selected'].nodes.set(new Set());
			} else if (code === 'KeyD' && e[`${modifier}Key`]) {
				duplicate.set(true);
				setTimeout(() => {
					duplicate.set(false);
				}, 100);
			} else if (key === 'Tab' && (e.altKey || e.ctrlKey)) {
				selectNextNode();
			} else if (key === 'l') {
				theme = theme === 'light' ? 'dark' : 'light';
			} else if (key === 'd') {
				drawer = !drawer;
			} else if (key === 'm') {
				minimap = !minimap;
			} else if (key === 'c') {
				controls = !controls;
			} else if (key === 'e') {
				const node = Array.from(selected)[0];
				graph.editing.set(node);
			} else {
				return;
			}

			e.preventDefault();
		} catch (error) {
			console.error('Error handling key down event:', error);
		}
	}

	function selectNextNode() {
		try {
			const nodes = graph.nodes.getAll();

			const currentIndex = nodes.findIndex((node) => selected.has(node));
			const nextIndex = currentIndex + 1;

			selected.delete(nodes[currentIndex]);
			selected.add(nodes[nextIndex]);
		} catch (error) {
			console.error('Error selecting next node:', error);
		}
	}

	function handleKeyUp(e: KeyboardEvent) {
		try {
			const { key } = e;

			if (isArrow(key)) {
				clearInterval(activeIntervals[key]);
				delete activeIntervals[key];
			} else if (key === 'Shift') {
				connectingFrom.set(null);
			}
		} catch (error) {
			console.error('Error handling key up event:', error);
		}
	}

	function handleScroll(e: WheelEvent) {
		try {
			if (fixedZoom) return;
			const multiplier = e.shiftKey ? 0.15 : 1;
			const { clientX, clientY, deltaY } = e;
			const currentTranslation = translation;
			const pointerPosition = { x: clientX, y: clientY };

			if ((trackpadPan || e.metaKey) && deltaY % 1 === 0) {
				translation = {
					x: (translation.x -= e.deltaX),
					y: (translation.y -= e.deltaY)
				};

				return;
			}

			if ((scale >= MAX_SCALE && deltaY < 0) || (scale <= MIN_SCALE && deltaY > 0)) return;

			const scrollAdjustment = Math.min(0.009 * multiplier * Math.abs(deltaY), 0.08);
			const newScale = calculateZoom(scale, Math.sign(deltaY), scrollAdjustment);

			const newTranslation = calculateTranslation(
				scale,
				newScale,
				currentTranslation,
				pointerPosition,
				graphDimensions
			);

			scale.set(newScale);
			translation.set(newTranslation);
		} catch (error) {
			console.error('Error handling scroll event:', error);
		}
	}

	function handleArrowKey(key: Arrow, e: KeyboardEvent) {
		try {
			const multiplier = e.shiftKey ? 2 : 1;
			const start = performance.now();
			const direction = key === 'ArrowLeft' || key === 'ArrowUp' ? 1 : -1;
			const leftRight = key === 'ArrowLeft' || key === 'ArrowRight';
			const startOffset = leftRight ? translation.x : translation.y;
			const endOffset = startOffset + direction * PAN_INCREMENT * multiplier;

			if (!activeIntervals[key]) {
				let interval = setInterval(() => {
					const time = performance.now() - start;

					if (selected.size === 0) {
						const movement = startOffset + (endOffset - startOffset) * (time / PAN_TIME);
						translation.set({
							x: leftRight ? movement : translation.x,
							y: leftRight ? translation.y : movement
						});
					} else {
						const delta = {
							x: leftRight ? -direction * 2 : 0,
							y: leftRight ? 0 : -direction * 2
						};
						Array.from(selected).forEach((node) => {
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
		} catch (error) {
			console.error('Error handling arrow key event:', error);
		}
	}
</script>

<section
	role="presentation"
	id={graph.id}
	class="svelvet-wrapper"
	{title}
	style:width={width ? width + 'px' : '100%'}
	style:height={height ? height + 'px' : '100%'}
	style:cursor={pannable ? 'move' : 'default'}
	onwheel={handleScroll}
	onmousedown={onMouseDown}
	ontouchend={onMouseUp}
	ontouchstart={onTouchStart}
	onkeydown={handleKeyDown}
	onkeyup={handleKeyUp}
	bind:this={graphDOMElement}
	tabindex={0}
>
	<GraphRenderer {isMovable}>
		{#if $editing}
			<Editor editing={$editing} />
		{/if}
		{@render children}
	</GraphRenderer>

	{#if backgroundExists}
		{@render background}
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
	{#if drawer}
		<svelte:component this={drawerComponent} />
	{/if}
	{#if contrast}
		<svelte:component this={contrastComponent} />
	{/if}
	{@render minimap}
	{@render drawer}
	{@render controls}
	{@render toggle}
	{@render contrast}
	{#if selecting && !disableSelection}
		<SelectionBox {creating} {anchor} graph={graph} {adding} color={selectionColor} />
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
