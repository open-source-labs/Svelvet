<script lang="ts">
  import { onMount } from 'svelte';
  import { zoom, zoomTransform } from 'd3-zoom';
  import { select, selectAll } from 'd3-selection';

  import SimpleBezierEdge from '$lib/views/Edges/SimpleBezierEdge.svelte';
  import StraightEdge from '$lib/views/Edges/StraightEdge.svelte';
  import SmoothStepEdge from '$lib/views/Edges/SmoothStepEdge.svelte';
  import StepEdge from '$lib/views/Edges/StepEdge.svelte';
  import EdgeAnchor from '$lib/views/Edges/EdgeAnchor.svelte';
  import Node from '$lib/views/Nodes/index.svelte';
  import ImageNode from '$lib/views/Nodes/ImageNode.svelte';

  import { findOrCreateStore } from '$lib/models/store_old';

  // leveraging d3 library to zoom/pan
  let d3 = {
    zoom,
    zoomTransform,
    select,
    selectAll,
  };

  //these are typscripted as any, however they have been transformed inside of store.ts
  export let nodesStore: any;
  export let derivedEdges: any;
  export let key: string;

  // here we lookup the store using the unique key
  const svelvetStore = findOrCreateStore(key);
  const {
    nodeSelected,
    backgroundStore,
    movementStore,
    widthStore,
    heightStore,
    d3Scale,
  } = svelvetStore;
  // declaring the grid and dot size for d3's transformations and zoom
  const gridSize = 15;
  const dotSize = 10;

  onMount(() => {
    d3.select(`.Edges-${key}`).call(d3Zoom);
    d3.select(`.Nodes-${key}`).call(d3Zoom);
  });

  // TODO: Update d3Zoom type (refer to d3Zoom docs)
  let d3Zoom: any = d3
    .zoom()
    .filter(() => !$nodeSelected)
    .scaleExtent([0.4, 2])
    .on('zoom', handleZoom);

  // function to handle zoom events - arguments: d3ZoomEvent
  function handleZoom(e: any): void {
    if (!$movementStore) return;

    //add a store that contains the current value of the d3-zoom's scale to be used in onMouseMove function
    d3Scale.set(e.transform.k);
    // should not run d3.select below if backgroundStore is false
    if ($backgroundStore) {
      d3.select(`#background-${key}`)
        .attr('x', e.transform.x)
        .attr('y', e.transform.y)
        .attr('width', gridSize * e.transform.k)
        .attr('height', gridSize * e.transform.k)
        .selectAll('#dot')
        .attr('x', (gridSize * e.transform.k) / 2 - dotSize / 2)
        .attr('y', (gridSize * e.transform.k) / 2 - dotSize / 2)
        .attr('opacity', Math.min(e.transform.k, 1));
    }
    // transform 'g' SVG elements (edge, edge text, edge anchor)
    d3.select(`.Edges-${key} g`).attr('transform', e.transform);
    // transform div elements (nodes)
    let transform = d3.zoomTransform(this);
    // selects and transforms all node divs from class 'Node' and performs transformation
    d3.select(`.Node-${key}`)
      .style(
        'transform',
        'translate(' +
          transform.x +
          'px,' +
          transform.y +
          'px) scale(' +
          transform.k +
          ')'
      )
      .style('transform-origin', '0 0');
  }
</script>

<!-- This is the container that holds GraphView and we have disabled right click functionality to prevent a sticking behavior -->
<div class={`Nodes Nodes-${key}`} on:contextmenu|preventDefault>
  <!-- This container is transformed by d3zoom -->
  <div class={`Node Node-${key}`}>
    {#each $nodesStore as node}
      {#if node.image && !node.data.label}
        <ImageNode {node} {key} />
      {:else}
        <Node {node} {key}>{node.data.label}</Node>
      {/if}
    {/each}
  </div>
</div>

<!-- rendering dots on the background depending on the zoom level -->
<svg class={`Edges Edges-${key}`} viewBox="0 0 {$widthStore} {$heightStore}">
  <defs>
    <pattern
      id={`background-${key}`}
      x="0"
      y="0"
      width={gridSize}
      height={gridSize}
      patternUnits="userSpaceOnUse"
    >
      <circle
        id="dot"
        cx={gridSize / 2 - dotSize / 2}
        cy={gridSize / 2 - dotSize / 2}
        r="0.5"
        style="fill: gray"
      />
    </pattern>
  </defs>

  {#if $backgroundStore}
    <rect width="100%" height="100%" style="fill: url(#background-{key});" />
  {/if}

  <!-- <g> tag defines which edge type to render depending on properties of edge object -->
  <g>
    {#each $derivedEdges as edge}
      {#if edge.type === 'straight'}
        <StraightEdge {edge} />
      {:else if edge.type === 'smoothstep'}
        <SmoothStepEdge {edge} />
      {:else if edge.type === 'step'}
        <StepEdge {edge} />
      {:else}
        <SimpleBezierEdge {edge} />
      {/if}
      <!-- sets anchor points type to either arrow or halfcircle-->
      {#if !edge.noHandle}
        <EdgeAnchor x={edge.sourceX} y={edge.sourceY} />
        {#if !edge.arrow}
          <EdgeAnchor x={edge.targetX} y={edge.targetY} />
        {/if}
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
