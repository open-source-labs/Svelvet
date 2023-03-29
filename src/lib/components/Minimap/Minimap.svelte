<script lang="ts">
	import { graphStore } from '$lib/stores';
	import { getContext as getContextBase } from 'svelte';
	import MinimapNode from './MinimapNode.svelte';
	import type { Graph } from '$lib/types';
	import type { Writable } from 'svelte/store';
	import type { GetContext } from '$lib/types';

	let graph: Writable<Graph>;
	const getContext = getContextBase as GetContext;
	let graphId = getContext('graphId');
	graph = graphStore.get(graphId);
	const { nodes, bounds } = $graph;
	const { top, bottom, left, right } = bounds;
	$: boundsWidth = $right - $left;
	$: boundsHeight = $bottom - $top;
	$: aspectRatio = boundsWidth / boundsHeight;

	console.log($left, $right, $top, $bottom);
</script>

<div class="minimap-wrapper">
	<div
		class="node-wrapper"
		style={`${
			boundsWidth > boundsHeight ? `width: 75%` : 'height: 75%'
		}; aspect-ratio: ${aspectRatio}`}
	>
		{#each Object.values($nodes) as node}
			<MinimapNode {node} {bounds} />
		{/each}
	</div>
</div>

<style>
	.minimap-wrapper {
		box-sizing: border-box;
		position: absolute;
		width: 100px;
		height: 100px;
		bottom: 10px;
		right: 10px;
		background-color: rgb(146, 141, 141);
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
