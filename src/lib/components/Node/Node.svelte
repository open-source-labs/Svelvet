<script lang="ts">
	import { getContext, onMount, setContext } from 'svelte';
	import type { ComponentType } from 'svelte';
	import type { Graph, Node, Theme } from '$lib/types';
	import Parameter from '../Parameter/Parameter.svelte';
	import Output from '../Output/Output.svelte';
	import Resizer from '../Resizer/Resizer.svelte';
	import { calculateFitContentWidth } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';
	import { NODE_COLOR_LIGHT, NODE_COLOR_DARK } from '$lib/constants';

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
	export let node: Node;

	const graph: Graph = getContext<Graph>('graph');
	setContext<Node>('node', node);
	const theme = getContext<Theme>('theme');

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
	const { selected: selectedNodeGroup, hidden: hiddenNodesGroup } = $groups;

	const snapTo: number = getContext('snapTo');

	// Creates reactive variable for whether the node is selected
	// We use this as a class directive in the component
	$: selectedNodes = selectedNodeGroup.nodes;
	$: selected = $selectedNodes.has(node);
	$: hiddenNodes = hiddenNodesGroup.nodes;

	$: console.log($selectedNodes);

	// Dynamically import the component for the node
	onMount(async () => {
		// Not every browser handles fit-content well, so this is a workaround
		// We assign fit-content, calculate those dimensions
		// And reassign the width store the max value of
		// The initial dom dimensions, the min dimenions calculated, or the initial store value
		// Spend more time looking into this and see if there is a more obvious fix
		const nodeRect = DOMnode.getBoundingClientRect();
		[minWidth, minHeight] = calculateFitContentWidth(DOMnode);
		$widthStore = Math.max(nodeRect.width, minWidth, $widthStore);
		$heightStore = Math.max(nodeRect.height, minHeight, $heightStore);

		if (!componentRef) return;
		DynamicComponent = (await import(`../${componentRef}/${componentRef}.svelte`)).default;
	});

	function onMouseUp() {
		isResizing.width = false;
		isResizing.height = false;
	}

	function toggleSelected() {
		if (selected) {
			if (node) $selectedNodes.delete(node);
			$selectedNodes = $selectedNodes;
		} else {
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

	const styles = {
		light: {
			background: NODE_COLOR_LIGHT
		},
		dark: {
			background: NODE_COLOR_DARK
		}
	};
</script>

<svelte:window on:mouseup|stopPropagation={onMouseUp} />

<!-- svelte-ignore a11y-non-interactive-element -->
<div
	role="figure"
	aria-labelledby="node"
	class="graph-node"
	tabindex="-1"
	{id}
	style:height={nodeHeight}
	style:width={nodeWidth}
	style:left={nodeLeft}
	style:top={nodeTop}
	class:selected
	class:collapsed
	style:--node-default-background={styles[theme].background}
	style:cursor={$draggable ? (isMovable ? 'grabbing' : 'grab') : 'not-allowed'}
	style="
			{borderRadius && `--border-radius: ${borderRadius}px`};
			{bgColor && `--node-background: ${bgColor}`};
			{textColor && `--text-color: ${textColor}`};
			{borderColor && `--border-color: ${borderColor}`}"
	bind:this={DOMnode}
	on:mouseup={onMouseUp}
	on:mousedown|stopPropagation|preventDefault={handleClick}
	on:keydown={handleKeydown}
>
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
			<h1>{$group}</h1>
		</header>
		<div class="header-divider" />
	{/if}
	{#if DynamicComponent}
		<svelte:component this={DynamicComponent} self={configObject} data={parentNodesArray} />
	{:else if !collapsed}
		<section class="parameters">
			{#if label && !header}<p class="node-name">{label}</p>{/if}
			{#if $outputs}
				<Output outputStore={outputs} {connectingFrom} />
			{/if}

			{#each Object.entries($properties) as [key, property] (key)}
				<Parameter
					config={config ? config.properties[key] : null}
					label={key}
					parameterStore={property}
				/>
			{/each}

			{#each Object.entries($inputs) as [key, input] (key)}
				<Parameter
					connectable
					config={config ? config.inputs[key] : null}
					label={key}
					parameterStore={input}
				/>
			{/each}
		</section>
	{/if}
	{#if resizable}
		<Resizer width height both {minWidth} {minHeight} />
	{/if}
</div>

<style>
	@import url('./Node.css');
</style>
