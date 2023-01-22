<script lang="ts">
  import { onMount } from 'svelte';
  import { zoom, zoomTransform } from 'd3-zoom';
  import { select, selectAll } from 'd3-selection';

  import SimpleBezierEdge from './SimpleBezierEdge.svelte';
  import StraightEdge from './StraightEdge.svelte';
  import SmoothStepEdge from './SmoothStepEdge.svelte';
  import StepEdge from './StepEdge.svelte';
  import EdgeAnchor from './EdgeAnchor.svelte';
  import Node from './Node.svelte';
  import ImageNode from './ImageNode.svelte';

  import { findStore } from '$lib/controllers/storeApi';

  // leveraging d3 library to zoom/pan
  let d3 = {
    zoom,
    zoomTransform,
    select,
    selectAll,
  };

  //these are typscripted as any, however they have been transformed inside of store.ts
  export let canvasId: string;

  // here we lookup the store using the unique key
  const svelvetStore = findStore(canvasId);
  const {
    edgesStore,
    nodesStore,
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
    d3.select(`.Edges-${canvasId}`).call(d3Zoom);
    d3.select(`.Nodes-${canvasId}`).call(d3Zoom);
  });

  // TODO: Update d3Zoom type (refer to d3Zoom docs)
  let d3Zoom: any = d3
    .zoom()
    .filter(() => !$nodeSelected)
    .scaleExtent([0.4, 2])
    .on('zoom', handleZoom);

  // function to handle zoom events - arguments: d3ZoomEvent
  function handleZoom(e: any): void {}

  $: nodes = Object.values($nodesStore);
  $: edges = Object.values($edgesStore);
</script>

<!-- This is the container that holds GraphView and we have disabled right click functionality to prevent a sticking behavior -->
<!-- This container is transformed by d3zoom -->
{#each nodes as node}
  {#if false}
    <ImageNode {node} {canvasId} />
  {:else}
    <Node nodeId={node.id} {canvasId}>{JSON.parse(node.data).label}</Node>
  {/if}
{/each}

<!-- rendering dots on the background depending on the zoom level -->
<svg
  class={`Edges Edges-${canvasId}`}
  viewBox="0 0 {$widthStore} {$heightStore}"
>
  <defs>
    <pattern
      id={`background-${canvasId}`}
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
    <rect
      width="100%"
      height="100%"
      style="fill: url(#background-{canvasId});"
    />
  {/if}

  <!-- <g> tag defines which edge type to render depending on properties of edge object -->
  <g>
    {#each edges as edge}
      {#if edge.type === 'straight'}
        <StraightEdge edgeId={edge.id} {canvasId} />
      {:else if edge.type === 'smoothstep'}
        <SmoothStepEdge {edge} />
      {:else if edge.type === 'step'}
        <StepEdge {edge} />
      {:else}
        <SimpleBezierEdge {edge} />
      {/if}
      <EdgeAnchor x={edge.sourceX} y={edge.sourceY} />
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
