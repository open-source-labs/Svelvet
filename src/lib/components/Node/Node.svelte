<script lang="ts">
	import Edge from '../Edge/Edge.svelte';
	import { onMount } from 'svelte';
	import type { ComponentType } from 'svelte';
	import type { WritableNode } from '$lib/types';
	import type { Writable } from 'svelte/store';
	import type { NodeKey, NodeStore } from '$lib/types';
	import ResizeControls from '../ResizeControls/ResizeControls.svelte';
	import Anchor from '../Anchor/Anchor.svelte';
	import { activeKeys } from '$lib/stores';

	// ASSIGN PROPS TO LOCAL VARIABLES
	export let node: WritableNode;

	export let isLocked;
	export let selectedNodes: Writable<Set<NodeKey>>;
	export let transforms;

	export let nodeStore: NodeStore;

	let curve: boolean = true;
	let moving = false;
	let DynamicComponent: ComponentType;

	const { dimensions, inputNodes, outputNodes, position, draggable, id } = $node;
	const { scale } = transforms;
	const { width, height } = dimensions;
	const { x, y } = position;

	// Dynamically import the component for the node
	onMount(async () => {
		if (!$node.componentRef) return;
		DynamicComponent = (await import(`../${$node.componentRef}/${$node.componentRef}.svelte`))
			.default;
	});

	function onMouseDown(e: MouseEvent) {
		if ($isLocked) return;
		moving = true;
		if ($activeKeys['Shift'] && $selectedNodes.has(id)) {
			$selectedNodes.delete(id);
			$selectedNodes = $selectedNodes;
		} else if ($activeKeys['Shift'] && !$selectedNodes.has(id)) {
			$selectedNodes.add(id);
			$selectedNodes = $selectedNodes;
		} else if (!$activeKeys['Shift'] && !$selectedNodes.has(id)) {
			$selectedNodes.clear();
			$selectedNodes.add(id);
			$selectedNodes = $selectedNodes;
		}
	}

	function onMouseMove(e: MouseEvent) {
		let { movementX, movementY } = e;
		if (moving) {
			moveNodes(movementX, movementY);
		}
	}

	function moveNodes(movementX: number, movementY: number) {
		for (const selectedNodeKey of $selectedNodes) {
			$nodeStore[selectedNodeKey].update((node) => {
				const position = node.position;
				const { x, y } = position;
				x.update((x) => x + movementX / $scale);
				y.update((y) => y + movementY / $scale);
				return node;
			});
		}
	}

	function handleKey(e: KeyboardEvent) {
		// if (e.key) movementX = 10;
		// if (moving) {
		// 	moveNode();
		// }
	}

	function onMouseUp() {
		moving = false;
	}

	function handleClick() {}

	// create an array of all the parent node keys
	$: parentNodesArray = Array.from($inputNodes).map((node) => node.configObject);
	const { configObject } = $node;
</script>

<svelte:window on:mousemove={onMouseMove} on:mouseup|stopPropagation={onMouseUp} />
<!-- NODE COMPONENT START -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div
	on:mouseup|self={onMouseUp}
	on:mousedown|stopPropagation={onMouseDown}
	on:click={handleClick}
	on:touchstart={handleClick}
	on:keydown={handleKey}
	tabindex={0}
	style="width: {$width}px;
    height: {$height}px;
    left: {$x}px;
    top: {$y}px;
    cursor: {$draggable ? 'not-allowed' : 'grab'}"
	class="graph-node"
	id={$node.id}
>
	{#if DynamicComponent}
		<svelte:component this={DynamicComponent} self={configObject} data={parentNodesArray} />
	{/if}
	<header class="header-wrapper">
		<p class="node-name" style="color: black">{$node.id}</p>
	</header>

	{#if $inputNodes.size}
		<input type="checkbox" bind:checked={curve} />
	{/if}

	{#if $selectedNodes.has($node.id)}
		<ResizeControls nodeKey={$node.id} />
	{/if}

	<div class="input-anchor-wrapper">
		{#each Array.from($inputNodes) as inputNode, index}
			<Anchor mode="input" nodeId={index.toString()} />
		{/each}
	</div>

	<div class="output-anchor-wrapper">
		{#each Array.from($outputNodes) as inputNode, index}
			<Anchor mode="output" nodeId={'output-' + index.toString()} />
		{/each}
	</div>
</div>

<!-- NODE COMPONENT END -->

<!-- FOR EACH CONNECTION, RENDER AN EDGE -->
{#each Array.from($outputNodes) as outputNode, index}
	<Edge
		edgeCount={Array.from($inputNodes).length}
		edgeNumber={index + 1}
		{curve}
		inputNode={$node}
		targetPosition={outputNode.position}
	/>
{/each}

<!-- RENDER EDGES END -->

<!-- TEMPORARY EDGE FOR WHEN REMOVING CONNECTION OR DRAGGING FROM OUTPUT -->
<!-- <Edge inputNode={$node} /> -->

<!-- STYLES -->
<style>
	.input-anchor-wrapper {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: start;
		gap: 5px;
		justify-content: center;
		pointer-events: none;
		overflow: hidden;
	}
	.output-anchor-wrapper {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: end;
		gap: 5px;
		justify-content: center;
		pointer-events: none;
		overflow: hidden;
	}

	.graph-node {
		box-sizing: border-box;
		cursor: grab;
		position: absolute;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-width: fit-content;
		padding: 5px;
		user-select: none;
	}

	.node-name {
		margin: 0px;
	}
	.header-wrapper {
		box-sizing: border-box;
		width: 100%;
		position: absolute;
		top: 0px;
		padding: 5px;
		border-bottom: solid 1px black;
		user-select: none;
	}

	.graph-node {
		border: solid 1px hsl(0, 0%, 5%);
		background-color: hsl(0, 0%, 100%);
		box-shadow: 2px 2px 20px 0 rgba(0, 0, 0, 0.2);
	}

	.graph-node:active {
		cursor: grabbing;
	}
</style>
