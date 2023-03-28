<script lang="ts">
	import Edge from '../Edge/Edge.svelte';
	import { onMount } from 'svelte';
	import type { ComponentType } from 'svelte';
	import type { ConfigObject, Graph, WritableNode } from '$lib/types';
	import ResizeControls from '../ResizeControls/ResizeControls.svelte';
	import Anchor from '../Anchor/Anchor.svelte';
	import { activeKeys } from '$lib/stores';
	import Slider from '../Slider/Slider.svelte';
	import { cursorPosition, initialClickPosition } from '$lib/stores/CursorStore';
	import type { Writable } from 'svelte/store';
	import type { Node } from '$lib/types';
	import Parameter from '../Parameter/Parameter.svelte';
	import { json } from '@sveltejs/kit';
	import Output from '../Output/Output.svelte';

	// ASSIGN PROPS TO LOCAL VARIABLES
	export let node: WritableNode;
	export let graph: Graph;

	let curve: boolean = true;
	let moving = false;
	let DynamicComponent: ComponentType;

	const { isLocked, transforms, bounds, nodes: nodeStore, groups } = graph;

	const { dimensions, inputs, outputs, properties, position, draggable, id, group, config } = $node;
	const { scale } = transforms;
	const { width, height } = dimensions;
	const { x, y } = position;
	const { top, bottom, left, right } = bounds;
	const { selected } = $groups;

	const { x: cursorX, y: cursorY } = cursorPosition;
	console.log($inputs);
	console.log(config);
	// Dynamically import the component for the node
	onMount(async () => {
		const { width: DOMwidth, height: DOMheight } = DOMnode.getBoundingClientRect();
		$width = DOMwidth;
		$height = DOMheight;
		if (!$node.componentRef) return;
		DynamicComponent = (await import(`../${$node.componentRef}/${$node.componentRef}.svelte`))
			.default;
	});

	function onMouseDown(e: MouseEvent) {
		if ($isLocked) return;
		$initialClickPosition = { x: $cursorX - $x, y: $cursorY - $y };
		moving = true;

		if ($activeKeys['Shift'] && $selected.has($node)) {
			$group = null;
			const { selected } = $groups;
			$selected.delete($node);
			$selected = $selected;
		} else if ($activeKeys['Shift'] && !$selected.has($node)) {
			$group = 'selected';
			$selected.add($node);
			$selected = $selected;
		} else if (!$activeKeys['Shift'] && !$selected.has($node)) {
			console.log($selected);
			Array.from($selected).forEach((node) => {
				const { group } = node;
				group.set(null);
			});
			$selected.clear();
			$selected.add($node);
			$selected = $selected;
			$group = 'selected';
		}
	}

	$: if (moving) {
		let oldX = $x;
		let newX = $cursorX - $initialClickPosition.x;

		let oldY = $y;
		let newY = $cursorY - $initialClickPosition.y;

		if ($group) moveNodes(newX - oldX, newY - oldY, $groups[$group]);
	}

	function moveNodes(deltaX: number, deltaY: number, nodeGroup: Writable<Set<Node>>) {
		nodeGroup.update((nodeGroup) => {
			nodeGroup.forEach((node) => {
				console.log(node);
				const { position } = node;
				const { x, y } = position;
				x.update((x) => {
					const newX = x + deltaX;
					if (deltaX < 0) {
						if (newX < $left) {
							$left = newX;
						}
					} else {
						if (newX + $width > $right) {
							$right = newX + $width;
						}
					}
					return newX;
				});
				y.update((y) => {
					const newY = y + deltaY;
					if (deltaY < 0) {
						if (newY < $top) {
							$top = newY;
						}
						if (y + $height === $bottom) {
							$bottom = newY + $height;
						}
					} else {
						if (newY + $height > $bottom) {
							$bottom = newY + $width;
						}
						if (y === $top) {
							$top = newY;
						}
					}
					return newY;
				});
			});
			return nodeGroup;
		});
	}

	function handleKey(e: KeyboardEvent) {
		// if (e.key) movementX = 10;
		// if (moving) {
		// 	moveNode();
		// }
	}

	function onMouseUp() {
		if (!moving) return;
		moving = false;
	}
	let collapsed = false;
	let DOMnode: HTMLElement;

	// $: if ($outputs) {
	// 	console.log(id);
	// 	console.log($outputs);
	// }
	$: {
	}

	function connect() {}
</script>

<svelte:window on:mouseup|stopPropagation={onMouseUp} />
<!-- NODE COMPONENT START -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<article
	bind:this={DOMnode}
	on:mouseup={onMouseUp}
	on:mousedown|stopPropagation={onMouseDown}
	on:keydown={handleKey}
	tabindex={0}
	style="width: {$width}px;
    height: {collapsed ? 0 : $height}px;
    left: {$x}px;
    top: {$y}px;
    cursor: {$draggable ? 'grab' : 'not-allowed'};
	z-index: {$selected.has($node) ? 100 : 0};
	overflow: {collapsed ? 'hidden' : 'visible'};
	--border-color: {$selected.has($node) ? 'black' : 'white'}"
	class="graph-node"
	id={$node.id}
>
	<!-- {#if DynamicComponent}
		<svelte:component this={DynamicComponent} self={configObject} data={parentNodesArray} />
	{/if} -->
	<div class="header-wrapper">
		<button on:click={() => (collapsed = !collapsed)}>+</button>
		<p class="node-name" style="color: black">{$node.id}</p>
	</div>
	{#if !collapsed}
		<div class="line" />
		<section class="parameters">
			{#if $outputs}
				<Output store={outputs} />
			{/if}
			{#if $properties}
				{#each Object.keys($properties) as key}
					<Parameter
						object={properties}
						config={config ? config.properties[key] : null}
						label={key}
						input={$properties[key]}
					/>
				{/each}
			{/if}

			{#if $inputs}
				{#each Object.keys($inputs) as key}
					<Parameter
						connectable
						object={inputs}
						config={config ? config.inputs[key] : null}
						label={key}
						input={$inputs[key]}
					/>
				{/each}
			{/if}
		</section>
	{/if}
</article>

<!-- NODE COMPONENT END -->

<!-- FOR EACH CONNECTION, RENDER AN EDGE -->
<!-- {#each Array.from($inputNodes) as inputNode, index}
	<Edge
		active={$selected.has($node)}
		edgeCount={Array.from($inputNodes).length}
		edgeNumber={index + 1}
		{curve}
		{inputNode}
		targetPosition={$node.position}
	/>
{/each} -->

<!-- RENDER EDGES END -->

<!-- TEMPORARY EDGE FOR WHEN REMOVING CONNECTION OR DRAGGING FROM OUTPUT -->
<!-- <Edge inputNode={$node} /> -->

<!-- STYLES -->
<style>
	.line {
		width: 100%;
		height: 1px;
		background-color: hsl(54, 81%, 48%);
	}
	.parameters {
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: center;
		gap: 5px;
		padding: 8px 8px;
		/* outline: solid 1px red; */
	}

	.graph-node {
		box-sizing: border-box;
		cursor: grab;
		position: absolute;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: center;
		min-width: fit-content;
		min-height: fit-content;
		user-select: none;
		border: solid 1px var(--border-color);
		background-color: hsl(0, 0%, 100%);
		box-shadow: 1px 4px 8px 0 rgba(0, 0, 0, 0.2);
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
		border-radius: 10px 10px 0px 0px;
	}

	.graph-node:active {
		cursor: grabbing;
	}
</style>
