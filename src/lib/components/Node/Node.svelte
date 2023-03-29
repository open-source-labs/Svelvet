<script lang="ts">
	import { getContext, onMount, setContext } from 'svelte';
	import type { ComponentType } from 'svelte';
	import type { Graph, Node, WritableNode } from '$lib/types';
	import { activeKeys, graphStore } from '$lib/stores';
	import { cursorPosition, initialClickPosition } from '$lib/stores/CursorStore';
	import { get } from 'svelte/store';
	import Parameter from '../Parameter/Parameter.svelte';
	import Output from '../Output/Output.svelte';
	import { createNode } from '$lib/utils';
	import { moveNodes } from './util';

	export let collapsible: boolean = false;
	export let hidden: boolean = false;
	export let header: boolean = false;
	export let width: number = 100;
	export let height: number = 100;
	export let dimensions;
	export let inputs: Node['inputs'];
	export let outputs: Node['outputs'];
	export let properties: Node['properties'];
	export let componentRef: Node['componentRef'];
	export let position: Node['position'];
	export let draggable: Node['draggable'];
	export let id: Node['id'];
	export let group: Node['group'];
	export let config: Node['config'];
	export let borderRadius: Node['borderRadius'];
	export let bgColor: Node['bgColor'];
	export let borderColor: Node['borderColor'];
	export let textColor: Node['textColor'];
	export let label: Node['label'] = 'Node';
	export let resizable = true;

	export let nodeId: string = Math.random().toString(36).substring(2, 8);
	//export let node: Node = createNode({ id: nodeId, dimensions: { width, height } });
	export let graph: Graph = get(graphStore.get(getContext('graphId').graphId));

	let isMoving = false;
	let isCollapsed = false;
	let isResizing = { width: false, height: false };
	let minWidth = 0;
	let minHeight = 0;

	let DOMnode: HTMLElement;
	let DynamicComponent: ComponentType;

	const { isLocked, connectingFrom, transforms, bounds, nodes: nodeStore, groups } = graph;

	const { width: widthStore, height: heightStore } = dimensions;
	const { x, y } = position;
	const { top, bottom, left, right } = bounds;
	const { selected: selectedNodes } = $groups;
	const node = get(graph.nodes.get(id));
	const { x: cursorX, y: cursorY } = cursorPosition;

	setContext('nodeId', id);
	const snapTo: number = getContext('snapTo');

	// Creates reactive variable for whether the node is selected
	// We use this as a class directive in the component
	$: selected = $selectedNodes.has(node);

	// If the node isResizable, update the dimensions stores
	$: if (isResizing.width || isResizing.height) {
		if (isResizing.height) $heightStore = Math.max(minHeight, $cursorY - $y);
		if (isResizing.width) $widthStore = Math.max(minWidth, $cursorX - $x);
	}

	// If the node isMovable, update the position stores
	$: if (isMoving) {
		const newX = $cursorX - $initialClickPosition.x;
		const newY = $cursorY - $initialClickPosition.y;

		if ($group) moveNodes(graph, newX - $x, newY - $y, $groups[$group], snapTo);
	}

	// Dynamically import the component for the node
	onMount(async () => {
		const { width: DOMwidth, height: DOMheight } = DOMnode.getBoundingClientRect();
		$widthStore = DOMwidth;
		console.log({ borderRadius });
		$heightStore = DOMheight;

		const min = calculateFitContentWidth(DOMnode);
		minWidth = min.width;
		minHeight = min.height;

		function calculateFitContentWidth(element) {
			element.style.width = 'fit-content';
			element.style.height = 'fit-content';
			const width = element.offsetWidth;
			const height = element.offsetHeight;
			element.style.width = DOMwidth;
			element.style.height = DOMheight;
			return { width, height };
		}

		if (!componentRef) return;
		DynamicComponent = (await import(`../${componentRef}/${componentRef}.svelte`)).default;
	});

	function handleClick() {
		// Check if graph is locked
		if ($isLocked) return;

		// Update initial click position store
		$initialClickPosition = { x: $cursorX - $x, y: $cursorY - $y };

		// Allow node to be moved
		isMoving = true;

		// If you click on a node that is already selected
		// Without holding shift, do nothing
		if (!$activeKeys['Shift'] && selected) return;

		// If you click on a new node outside of the current group, clear the group
		if (!$activeKeys['Shift'] && !selected) {
			Array.from($selectedNodes).forEach((node) => {
				const { group } = node;
				group.set(null);
			});
			$selectedNodes.clear();
		}

		// Toggle the selected state of the node
		toggleSelected();
	}

	function onMouseUp() {
		setResize(null);
		if (!isMoving) return;
		isMoving = false;
	}

	function toggleSelected() {
		if (selected) {
			$group = null;
			if (node) $selectedNodes.delete(node);
			$selectedNodes = $selectedNodes;
		} else {
			$group = 'selected';
			if (node) $selectedNodes.add(node);
			$selectedNodes = $selectedNodes;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		// If node is focused, hitting enter will toggle the selected state
		if (e.key === 'Enter') {
			toggleSelected();
		} else if (e.key === 'Backspace') {
			nodeStore.update((nodes) => {
				nodes[id].set(null);
				return nodes;
			});
		}
	}

	function setResize(mode: 'width' | 'height' | 'both' | null) {
		if (mode === null) {
			isResizing.width = false;
			isResizing.height = false;
		} else {
			isResizing.width = mode === 'width' || mode === 'both';
			isResizing.height = mode === 'height' || mode === 'both';
		}
	}
</script>

<svelte:window on:mouseup|stopPropagation={onMouseUp} />

<!-- NODE COMPONENT START -->
<div
	bind:this={DOMnode}
	on:mouseup={onMouseUp}
	on:mousedown|stopPropagation={handleClick}
	on:keydown={handleKeydown}
	tabindex={0}
	class="graph-node"
	id="node-{id}"
	role="button"
	class:selected
	class:isCollapsed
	style="width: {$widthStore}px;
    height: {$heightStore}px;
    left: {$x}px;
    top: {$y}px;
    cursor: {$draggable ? (isMoving ? 'grabbing' : 'grab') : 'not-allowed'};
	{borderRadius && `--border-radius: ${borderRadius}px`};
	{bgColor && `--node-background: ${bgColor}`};
	{textColor && `--text-color: ${textColor}`};
	{borderColor && `--border-color: ${borderColor}`}"
>
	<!-- {#if DynamicComponent}
		<svelte:component this={DynamicComponent} self={configObject} data={parentNodesArray} />
	{/if} -->
	{#if header}
		<header class="header-wrapper">
			{#if collapsible}
				<button on:click={() => (isCollapsed = !isCollapsed)}>+</button>
			{/if}
			<p class="node-name">{label}</p>
		</header>
		<div class="header-divider" />
	{/if}
	{#if !isCollapsed}
		<section class="parameters">
			{#if label && !header}<p class="node-name">{label}</p>{/if}
			{#if $outputs}
				<Output {graph} outputStore={outputs} {connectingFrom} {node} />
			{/if}
			{#if $properties}
				{#each Object.keys($properties) as key}
					<Parameter
						{node}
						{graph}
						store={properties}
						config={config ? config.properties[key] : null}
						label={key}
						parameterStore={$properties[key]}
					/>
				{/each}
			{/if}

			{#if $inputs}
				{#each Object.keys($inputs) as key}
					<Parameter
						{node}
						{graph}
						connectable
						store={inputs}
						config={config ? config.inputs[key] : null}
						label={key}
						parameterStore={$inputs[key]}
					/>
				{/each}
			{/if}
		</section>
	{/if}
	{#if resizable}
		<div class="resize-width" on:mousedown|stopPropagation={() => setResize('width')} />
		<div class="resize-height" on:mousedown|stopPropagation={() => setResize('height')} />
		<div class="resize-both" on:mousedown|stopPropagation={() => setResize('both')} />
	{/if}
</div>

<!-- NODE COMPONENT END -->

<!-- STYLES -->
<style>
	.resize-width {
		width: 5px;
		height: calc(100% - 4px);
		position: absolute;
		right: -1px;
		top: -1px;
		cursor: ew-resize;
	}

	.resize-both {
		width: 6px;
		height: 6px;
		position: absolute;
		bottom: -1px;
		right: -1px;
		cursor: nwse-resize;
	}

	.resize-height {
		width: calc(100% - 4px);
		height: 5px;
		position: absolute;
		left: -1px;
		bottom: -1px;
		cursor: ns-resize;
	}

	.header-divider {
		width: 100%;
		height: 1px;
		background-color: hsl(54, 81%, 48%);
	}
	.parameters {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 5px;
		padding: 8px 8px;
		width: 100%;
		/* outline: solid 1px red; */
	}

	.graph-node {
		--border-color: white;
		border: solid 1px var(--border-color);
		border-radius: var(--border-radius, 10px);
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: center;
		min-width: fit-content;
		min-height: fit-content;
		user-select: none;
		cursor: grab;
		position: absolute;
		color: var(--text-color);
		background-color: var(--node-background);
		box-shadow: 1px 4px 8px 0 rgba(0, 0, 0, 0.2);
		margin: 0;
		padding: 0;
	}

	.node-name {
		margin: 0px;
	}

	.header-wrapper {
		width: 100%;
		height: 2rem;
		padding: 5px;
		display: flex;
		gap: 6px;
		background-color: rgb(237, 213, 4);
		border-radius: var(--border-radius, 10px) var(--border-radius, 10px) 0 0;
	}

	.selected {
		z-index: 10;
		--border-color: black;
	}

	.isCollapsed {
		height: 0px;
		overflow: hidden;
	}
</style>
