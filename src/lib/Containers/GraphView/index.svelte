<script>
	import { onMount } from "svelte";
	import { zoom, zoomTransform } from "d3-zoom";
	import { select, selectAll } from "d3-selection";
	import SimpleBezierEdge from '$lib/Edges/SimpleBezierEdge.svelte';
	import EdgeAnchor from "$lib/Edges/EdgeAnchor.svelte";
	import Node from '$lib/Nodes/index.svelte';
	import { nodeSelected } from '$lib/stores/store';

	let d3 = {
		zoom,
		zoomTransform,
		select,
		selectAll
	};

	export let nodesStore;
	export let derivedEdges; 

	onMount(() => {
		initZoom();
	})
	
	let d3Zoom = d3.zoom()
			.filter(() => !$nodeSelected)
			.on('zoom', handleZoom);
	
	function initZoom() {
		d3.select('svg').call(d3Zoom);
		d3.select('.Nodes').call(d3Zoom);
	}

	function handleZoom(e) {
		d3.select('svg g')
			.attr('transform', e.transform);
		let transform = d3.zoomTransform(this);
		d3.select('.Node').style('transform', "translate(" + transform.x + "px," + transform.y + "px) scale(" + transform.k + ")").style('transform-origin', '0 0');
	}

</script>

<div class="Nodes">
	<div class="Node">
		{#each $nodesStore as node}
			<Node {node}>{node.data.label}</Node>
		{/each}
	</div>
</div>

<svg class="Edges" viewBox="0 0 600 600">
	<g>
		{#each $derivedEdges as edge}
			<EdgeAnchor x={edge.sourceX} y={edge.sourceY} />
			<SimpleBezierEdge {edge} />
			<EdgeAnchor x={edge.targetX} y={edge.targetY} />
		{/each}
	</g>
</svg>

<style>
	.Nodes {
		width: 600px;
		height: 600px; 
		position: absolute;
	}
	.Node {
		width: 100%;
		height: 100%; 
	}
</style>