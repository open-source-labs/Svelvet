<script lang="ts">
	import { graphStore } from '$lib/stores';
	import { getContext } from 'svelte';
	import MinimapNode from './MinimapNode.svelte';
	import type { Graph } from '$lib/types';
	import type { Writable } from 'svelte/store';
	import type { Node } from '$lib/types';

	export let width = 100;
	export let height = 100;
	export let mapColor = 'white';

	let graph: Graph = getContext<Graph>('graph');
	const { nodes, bounds, groups } = graph;

	const { top, bottom, left, right } = bounds;

	$: hidden = $groups.hidden.nodes;
	$: boundsWidth = $right - $left;
	$: boundsHeight = $bottom - $top;
	$: aspectRatio = boundsWidth / boundsHeight;

	function toggleHidden(node: Node) {
		console.log('toggleHidden', node);
		if ($hidden.has(node)) {
			$hidden.delete(node);
		} else {
			$hidden.add(node);
		}
		$hidden = $hidden;
	}
</script>

<div
	class="minimap-wrapper"
	style:width="{width}px"
	style:height="{height ? height : width}px"
	style:--default-minimap-background-color={mapColor}
>
	<div
		class="node-wrapper"
		style:aspect-ratio={aspectRatio}
		style="{boundsWidth > boundsHeight ? `width: 80%` : 'height: 80%'};"
	>
		{#each Object.values($nodes) as node}
			<MinimapNode {node} {bounds} hidden={$hidden.has(node)} {toggleHidden} />
		{/each}
	</div>
</div>

<style>
	.minimap-wrapper {
		box-sizing: border-box;
		position: absolute;
		bottom: 10px;
		right: 10px;
		background-color: var(--minimap-background-color, var(--default-minimap-background-color));
		border-radius: 10px;
		overflow: hidden;
		box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.5);
		border: solid 1px black;
		z-index: 10;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.node-wrapper {
		box-sizing: border-box;
		position: absolute;
	}
</style>
