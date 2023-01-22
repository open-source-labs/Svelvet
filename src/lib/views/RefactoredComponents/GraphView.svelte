<script lang="ts">
  import { onMount } from 'svelte';
  import { zoom, zoomTransform } from 'd3-zoom';
  import { select, selectAll } from 'd3-selection';

  // import SimpleBezierEdge from '$lib/views/Edges/SimpleBezierEdge.svelte';
  // import StraightEdge from '$lib/views/Edges/StraightEdge.svelte';
  // import SmoothStepEdge from '$lib/views/Edges/SmoothStepEdge.svelte';
  // import StepEdge from '$lib/views/Edges/StepEdge.svelte';
  // import EdgeAnchor from '$lib/views/Edges/EdgeAnchor.svelte';
  import Node from './Node.svelte';
  // import ImageNode from '$lib/views/Nodes/ImageNode.svelte';

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
</script>

<div>{JSON.stringify(nodes)}</div>

<!-- This is the container that holds GraphView and we have disabled right click functionality to prevent a sticking behavior -->
<!-- This container is transformed by d3zoom -->
{#each nodes as node}
  {#if false}
    <ImageNode {node} {canvasId} />
  {:else}
    <Node nodeId={node.id} {canvasId}>{JSON.parse(node.data).label}</Node>
  {/if}
{/each}
