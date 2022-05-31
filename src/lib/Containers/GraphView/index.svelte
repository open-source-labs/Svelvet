<script lang="ts">
	import { onMount } from 'svelte';
	import { zoom, zoomTransform } from 'd3-zoom';
	import { select, selectAll } from 'd3-selection';

	import SimpleBezierEdge from '$lib/Edges/SimpleBezierEdge.svelte';
	import StraightEdge from '$lib/Edges/StraightEdge.svelte';
	import EdgeAnchor from '$lib/Edges/EdgeAnchor.svelte';
	import Node from '$lib/Nodes/index.svelte';

	import { nodeSelected, backgroundStore, widthStore, heightStore } from '$lib/stores/store';

	// leveraging d3 library to zoom/pan 
	let d3 = {
		zoom,
		zoomTransform,
		select,
		selectAll
	};

	export let nodesStore: any;
	export let derivedEdges: any;

	const gridSize = 15;
	const dotSize = 10;

	onMount(() => {
		d3.select('svg').call(d3Zoom);
		d3.select('.Nodes').call(d3Zoom);
	});

	let d3Zoom = d3
		.zoom()
		.filter(() => !$nodeSelected)
		.scaleExtent([0.4, 2])
		.on('zoom', handleZoom);

	function handleZoom(e) {
		// should not run d3.select below if backgroundStore is false
		if ($backgroundStore) {	
			d3.select('#background')
				.attr('x', e.transform.x)
				.attr('y', e.transform.y)
				.attr('width', gridSize * e.transform.k)
				.attr('height', gridSize * e.transform.k)
			  .selectAll('#dot')
				.attr('x', (gridSize * e.transform.k / 2) - (dotSize / 2))
				.attr('y', (gridSize * e.transform.k / 2) - (dotSize / 2))
				.attr('opacity', Math.min(e.transform.k, 1));
		}
		// transform 'g' SVG elements (edge, edge text, edge anchor)
		d3.select('svg g')
			.attr('transform', e.transform)
		// transform div elements (nodes)
		let transform = d3.zoomTransform(this);
		// selects and transforms all node divs from class 'Node'
		d3.select('.Node')
			.style(
				'transform',
				'translate(' + transform.x + 'px,' + transform.y + 'px) scale(' + transform.k + ')'
			)
			.style('transform-origin', '0 0');
	}
</script>

<div class="Nodes">
	<div class="Node">
		{#each $nodesStore as node}
			<Node {node}>{node.data.label}</Node>
		{/each}
	</div>
</div>

<svg class="Edges" viewBox="0 0 {$widthStore} {$heightStore}">
	<defs>
		<pattern id="background"
				x="0" y="0" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse" >
			<circle
				id="dot" 
				cx={(gridSize / 2) - (dotSize / 2)} 
				cy={(gridSize / 2) - (dotSize / 2)}
				r="0.5" 
				style="fill: gray" />
		</pattern>
	</defs>

	{#if $backgroundStore} 
		<rect width="100%" height="100%" style="fill: url(#background);" />
	{/if}

	<g>
		{#each $derivedEdges as edge}
			{#if edge.type === 'straight'}
				<StraightEdge {edge} />
			{:else}
				<SimpleBezierEdge {edge} />
			{/if}
			<EdgeAnchor x={edge.sourceX} y={edge.sourceY} />
			{#if !edge.arrow}
				<EdgeAnchor x={edge.targetX} y={edge.targetY} />
			{/if}
		{/each}
	</g>
</svg>

<style>
	.Nodes {
		position: absolute;
		width: 100%;
		height: 100%;
	}
	.Node {
		color: black; /* remove this once color is set to default via types */
		width: 100%;
		height: 100%;
	}
</style>
