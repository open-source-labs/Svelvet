<script lang="ts">
	import { NODE_HEADER_COLOR_LIGHT } from '$lib/constants';
	import { getContext } from 'svelte';
	import type { Graph, Node } from '$lib/types';

	const node = getContext<Node>('node');
	const graph = getContext<Graph>('graph');

	$: groups = graph.groups;
	$: hiddenNodes = $groups.hidden.nodes;
	$: headerColor = node.headerColor;
	$: height = node.headerHeight;
	$: collapsible = node.collapsible;
	$: hideable = node.hideable;
	$: label = node.label;
	$: id = node.id;
	$: collapsed = node.collapsed;

	function hideNode() {
		$hiddenNodes.add(node);
		$hiddenNodes = $hiddenNodes;
	}
</script>

<header
	style:--header-default-background-color={$headerColor || NODE_HEADER_COLOR_LIGHT}
	class:collapsed
	style:height="{$height}px"
	class="node-header"
>
	{#if collapsible}
		<button
			class="collapse-button"
			on:click={() => {
				$collapsed = !collapsed;
			}}>+</button
		>
	{/if}
	{#if hideable}
		<button class="hide-button" on:click={hideNode}> - </button>
	{/if}
	<!-- <p class="node-name">{$label || id}</p> -->
</header>

<style>
	.node-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: var(--header-default-background-color);
		padding: 0 10px;
	}

	.node-name {
		font-size: 1.2rem;
	}

	.collapse-button {
		font-size: 1.5rem;
	}

	.hide-button {
		font-size: 1.2rem;
	}

	.collapsed {
		overflow: hidden;
	}
</style>
