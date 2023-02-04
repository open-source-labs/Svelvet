<script lang="ts">
  import { onMount } from 'svelte';
  import { zoom, zoomTransform, zoomIdentity } from 'd3-zoom';
  import { select, selectAll, pointer, local } from 'd3-selection';

  import SimpleBezierEdge from '$lib/edges/views/Edges/SimpleBezierEdge.svelte';
  import StepEdge from '$lib/edges/views/Edges/StepEdge.svelte';
  import SmoothStepEdge from '$lib/edges/views/Edges/SmoothStepEdge.svelte';

  import StraightEdge from '$lib/edges/views/Svelvet3Components/StraightEdge.svelte';
  //import SmoothStepEdge from './SmoothStepEdge.svelte';
  //  import StepEdge from './StepEdge.svelte';
  import EdgeAnchor from '$lib/edges/views/Svelvet3Components/EdgeAnchor.svelte';
  import ResizeNode from '$lib/resizableNodes/views/ResizeNode.svelte';

  import Node from '$lib/nodes/views/Node.svelte';

  import { findStore } from '$lib/store/controllers/storeApi';
  import PotentialAnchor from '../../interactiveNodes/views/PotentialAnchor.svelte';
  import TemporaryEdge from '../../interactiveNodes/views/TemporaryEdge.svelte';
  import { determineD3Instance, zoomInit } from '$lib/d3/controllers/d3';
  import { d3ZoomCreator } from '$lib/d3/controllers/d3Old';

  import MinimapBoundary from '$lib/Minimap/MinimapBoundary.svelte';
  import MinimapBoundless from '$lib/Minimap//MinimapBoundless.svelte';
  //these are typscripted as any, however they have been transformed inside of store.ts
  export let canvasId: string;
  export let width: number;
  export let height: number;
  export let initialZoom = 3;
  export let initialLocation;
  export let boundary = false;

  // here we lookup the store using the unique key
  const store = findStore(canvasId);
  const {
    edgesStore,
    nodesStore,
    anchorsStore,
    potentialAnchorsStore,
    temporaryEdgeStore,
    resizeNodesStore,
    nodeSelected,
    backgroundStore,
    movementStore,
    widthStore,
    heightStore,
    d3Scale,
  } = store;
  $: nodes = Object.values($nodesStore);
  $: edges = Object.values($edgesStore);
  $: anchors = Object.values($anchorsStore);
  $: resize = Object.values($resizeNodesStore);
  $: potentialAnchors = Object.values($potentialAnchorsStore);
  $: tempEdges = $temporaryEdgeStore;
  // declaring the grid and dot size for d3's transformations and zoom
  const gridSize = 15;
  const dotSize = 10;

  // leveraging d3 library to zoom/pan
  let d3 = {
    zoom,
    zoomTransform,
    zoomIdentity,
    select,
    selectAll,
    pointer,
  };
  let d3Zoom = determineD3Instance(
    boundary,
    d3,
    nodeSelected,
    width,
    height,
    movementStore,
    backgroundStore,
    gridSize,
    dotSize,
    canvasId,
    d3Scale,
    handleZoom
  );

  // d3Translate is used for the minimap
  let d3Translate = { x: 0, y: 0, k: 1 };
  onMount(() => {
    // actualizes the d3 instance
    d3.select(`.Edges-${canvasId}`).call(d3Zoom);
    d3.select(`.Nodes-${canvasId}`).call(d3Zoom);
    d3.select(`#background-${canvasId}`).call(d3Zoom);
    d3.selectAll('#dot').call(d3Zoom); // TODO: this should be a class, not an ID
    d3Translate = zoomInit(
      d3,
      canvasId,
      d3Zoom,
      d3Translate,
      initialLocation,
      initialZoom,
      d3Scale
    );
  });

  // moves canvas when you click on the minimap
  // handles case for when minimap sends message back to initiate translation event (click to traverse minimap)
  // moves camera to the clicked node
  function miniMapClick(event) {
    // onclick in case of boundless minimap
    if (!boundary) {
      // For edges
      d3.select(`.Edges-${key}`)
        .transition()
        .duration(500)
        .call(d3Zoom.translateTo, event.detail.x, event.detail.y);
      // For nodes
      d3.select(`.Nodes-${key}`)
        .transition()
        .duration(500)
        .call(d3Zoom.translateTo, event.detail.x, event.detail.y);
    }
    // handles case for when minimap has a boundary
    else {
      // For edges
      d3.select(`.Edges-${key}`)
        .transition()
        .duration(500)
        .call(d3Zoom.translateTo, event.detail.x, event.detail.y);
      // For nodes
      d3.select(`.Nodes-${key}`)
        .transition()
        .duration(500)
        .call(d3Zoom.translateTo, event.detail.x, event.detail.y);
    }
  }

  const minimap = true; // QQQ
  const key = canvasId;

  function handleZoom(e) {
    if (!$movementStore) return;
    //add a store that contains the current value of the d3-zoom's scale to be used in onMouseMove function
    d3Scale.set(e.transform.k);
    // should not run d3.select below if backgroundStore is false
    if (backgroundStore) {
      d3.select(`#background-${canvasId}`)
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
    d3.select(`.Edges-${canvasId} g`).attr('transform', e.transform);
    // transform div elements (nodes)
    let transform = d3.zoomTransform(this);
    d3Translate = transform;
    // selects and transforms all node divs from class 'Node' and performs transformation
    d3.select(`.Node-${canvasId}`)
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
<div id="graphview-container">
  {#if minimap && boundary}
    <MinimapBoundary on:message={miniMapClick} {key} {boundary} {d3Translate} />
  {:else if minimap}
    <MinimapBoundless on:message={miniMapClick} {key} {d3Translate} />
  {/if}

  <div class={`Nodes Nodes-${canvasId}`} on:contextmenu|preventDefault>
    <!-- This container is transformed by d3zoom -->
    <div class={`Node Node-${canvasId}`}>
      {#each nodes as node}
        {#if node.data.html}
          <Node {node} {canvasId} {nodes} nodeId={node.id}
            >{@html node.data.html}</Node
          >
        {:else if node.data.custom}
          <Node {node} {canvasId} {nodes} nodeId={node.id}
            ><svelte:component this={node.data.custom} /></Node
          >
        {:else}
          <Node {node} {canvasId} {nodes} nodeId={node.id}
            >{node.data.label}</Node
          >
        {/if}
      {/each}

      {#each resize as res}
        <ResizeNode resizeId={res.id} {canvasId} />
      {/each}

      {#each potentialAnchors as potentialAnchor}
        <PotentialAnchor
          {canvasId}
          x={potentialAnchor.positionX}
          y={potentialAnchor.positionY}
          {potentialAnchor}
        />
      {/each}
    </div>
  </div>
</div>
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
        <SmoothStepEdge {edge} {canvasId} />
      {:else if edge.type === 'step'}
        <StepEdge {edge} {canvasId} />
      {:else}
        <SimpleBezierEdge edgeId={edge.id} {canvasId} />
      {/if}
    {/each}

    {#each tempEdges as temporaryEdge}
      <TemporaryEdge {temporaryEdge} />
    {/each}

    {#each anchors as anchor}
      <!-- note that these are SVG -->
      <EdgeAnchor x={anchor.positionX} y={anchor.positionY} />
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
