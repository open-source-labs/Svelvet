<script lang="ts">
	import GraphView from '$lib/Containers/GraphView/index.svelte';
	import { nodesStore, edgesStore, derivedEdges, widthStore, heightStore, backgroundStore } from '$lib/stores/store';
	import { onMount } from 'svelte';

	export let nodes: any;
	export let edges: any;
	export let width: number = 600;
	export let height: number = 600;
	export let background: boolean = false; 

	onMount(() => {
		$nodesStore = nodes;
		$edgesStore = edges;
		$widthStore = width;
		$heightStore = height;
		$backgroundStore = background;
	});
</script>

<div class="Svelvet" style={`width: ${$widthStore}px; height: ${$heightStore}px`}>
	<GraphView {nodesStore} {derivedEdges} />
</div>

<style>
	.Svelvet {
		position: relative;
		overflow: hidden;
		display: grid;
		font-family: 'Segoe UI', sans-serif;
		background-color: white;
	}
</style>
