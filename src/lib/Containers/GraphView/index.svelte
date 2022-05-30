<script>
	import { onMount } from 'svelte';
	import { zoom, zoomTransform } from 'd3-zoom';
	import { select, selectAll } from 'd3-selection';

	import SimpleBezierEdge from '$lib/Edges/SimpleBezierEdge.svelte';
	import StraightEdge from '$lib/Edges/StraightEdge.svelte';
	import EdgeAnchor from '$lib/Edges/EdgeAnchor.svelte';
	import EdgeArrow from '$lib/Edges/EdgeArrow.svelte';
	import Node from '$lib/Nodes/index.svelte';
	import { nodeSelected, widthStore, heightStore } from '$lib/stores/store';

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
	});

	let d3Zoom = d3
		.zoom()
		.filter(() => !$nodeSelected)
		.on('zoom', handleZoom);

	function initZoom() {
		d3.select('svg').call(d3Zoom);
		d3.select('.Nodes').call(d3Zoom);
	}

	function handleZoom(e) {
		d3.select('svg g').attr('transform', e.transform);
		let transform = d3.zoomTransform(this);
		d3.select('.Node')
			.style(
				'transform',
				'translate(' + transform.x + 'px,' + transform.y + 'px) scale(' + transform.k + ')'
			)
			.style('transform-origin', '0 0');
	}
</script>

<div class="Nodes" style={`width: ${$widthStore}px; height: ${$heightStore}px`}>
	<div class="Node">
		{#each $nodesStore as node}
			<Node {node}>{node.data.label}</Node>
		{/each}
	</div>
</div>

<svg class="Edges" viewBox={`0 0 ${$widthStore} ${$heightStore}`}>
	<g>
		{#each $derivedEdges as edge}
			{#if edge.type === 'straight'}
				<StraightEdge {edge} />
			{:else}
				<SimpleBezierEdge {edge} />
			{/if}
			<EdgeAnchor x={edge.sourceX} y={edge.sourceY} />
			<EdgeAnchor x={edge.targetX} y={edge.targetY} />
		{/each}
	</g>
</svg>

<style>
	.Nodes {
		position: absolute;
	}
	.Node {
		color: black;
		width: 100%;
		height: 100%;
	}
</style>
