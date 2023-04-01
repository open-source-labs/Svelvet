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
	import { moveNodes } from './moveNodes';
	import type { Writable } from 'svelte/store';
	import Resizer from '../Resizer/Resizer.svelte';
	import { calculateFitContentWidth } from './calculateFitContent';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch('nodeClicked', { node, selected });
	}

	export let collapsible: boolean = true;
	export let visible: Node['visible'];
	export let header: boolean = true;
	export let width: number = 100;
	export let height: number = 100;
	export let dimensions: Node['dimensions'];
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
	export let graph: Graph = graphStore.get(getContext('graphId').graphId);

	let isMovable = false;
	let collapsed = false;
	let isResizing = { width: false, height: false };
	let minWidth = 0;
	let minHeight = 0;

	let DOMnode: HTMLElement;
	let DynamicComponent: ComponentType;

	const { isLocked, connectingFrom, transforms, bounds, nodes: nodeStore, groups } = graph;

	const { width: widthStore, height: heightStore } = dimensions;
	const { x, y } = position;
	const { selected: selectedNodes, hidden: hiddenNodes } = $groups;
	const node = graph.nodes.get(id);
	const { x: cursorX, y: cursorY } = cursorPosition;

	setContext('nodeId', id);
	const snapTo: number = getContext('snapTo');

	// Creates reactive variable for whether the node is selected
	// We use this as a class directive in the component
	$: selected = $selectedNodes.has(node);

	setContext('resizeData', {
		heightStore,
		widthStore,
		minHeight,
		minWidth,
		x,
		y
	});

	// Dynamically import the component for the node
	onMount(async () => {
		const { width: DOMwidth, height: DOMheight } = DOMnode.getBoundingClientRect();
		$widthStore = DOMwidth;
		console.log({ borderRadius });
		$heightStore = DOMheight;

		const min = calculateFitContentWidth(DOMnode);
		minWidth = min.width;
		minHeight = min.height;

		if (!componentRef) return;
		DynamicComponent = (await import(`../${componentRef}/${componentRef}.svelte`)).default;
	});

	function onMouseUp() {
		isResizing.width = false;
		isResizing.height = false;
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
			delete $nodeStore[id];
			$nodeStore = $nodeStore;
		}
	}

	function hideNode() {
		$hiddenNodes.add(node);
		$hiddenNodes = $hiddenNodes;
	}

	// Dynamic CSS styles based on store values
	$: nodeWidth = `${$widthStore}px`;
	$: nodeHeight = `${$heightStore}px`;
	$: nodeLeft = `${$x}px`;
	$: nodeTop = `${$y}px`;
</script>

<svelte:window on:mouseup|stopPropagation={onMouseUp} />

<div
	bind:this={DOMnode}
	on:mouseup={onMouseUp}
	on:mousedown|stopPropagation={handleClick}
	on:keydown={handleKeydown}
	tabindex={0}
	class="graph-node"
	{id}
	role="button"
	style:height={nodeHeight}
	style:width={nodeWidth}
	style:left={nodeLeft}
	style:top={nodeTop}
	class:selected
	class:collapsed
	style:cursor={$draggable ? (isMovable ? 'grabbing' : 'grab') : 'not-allowed'}
	style="
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
				<button
					on:click={() => {
						collapsed = !collapsed;
					}}>+</button
				>
			{/if}
			<button on:click={hideNode}> - </button>
			<p class="node-name">{label || id}</p>
		</header>
		<div class="header-divider" />
	{/if}
	{#if !collapsed}
		<section class="parameters">
			{#if label && !header}<p class="node-name">{label}</p>{/if}
			{#if $outputs}
				<Output {graph} outputStore={outputs} {connectingFrom} {node} />
			{/if}

			{#each Object.entries($properties) as [key, property] (key)}
				<Parameter
					{node}
					{graph}
					store={properties}
					config={config ? config.properties[key] : null}
					label={key}
					parameterStore={property}
				/>
			{/each}

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
		</section>
	{/if}
	{#if resizable}
		<Resizer width height both {graph} />
	{/if}
</div>

<style>
	@import url('./Node.css');
</style>
