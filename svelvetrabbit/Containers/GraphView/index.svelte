<script>import { onMount } from 'svelte';
  import { zoom, zoomTransform, zoomIdentity } from 'd3-zoom';
  import { select, selectAll, pointer } from 'd3-selection';
  import SimpleBezierEdge from '../../Edges/SimpleBezierEdge.svelte';
  import StraightEdge from '../../Edges/StraightEdge.svelte';
  import SmoothStepEdge from '../../Edges/SmoothStepEdge.svelte';
  import StepEdge from '../../Edges/StepEdge.svelte';
  import EdgeAnchor from '../../Edges/EdgeAnchor.svelte';
  import Minimap from '../Minimap/Minimap.svelte';
  import Node from '../../Nodes/index.svelte';
  import ImageNode from '../../Nodes/ImageNode.svelte';
  import { findOrCreateStore } from '../../stores/store';
  
  // leveraging d3 library to zoom/pan
  let d3 = {
      zoom,
      zoomTransform,
      zoomIdentity,
      select,
      selectAll,
      pointer
  };
  //these are typscripted as any, however they have been transformed inside of store.ts
  export let nodesStore;
  export let derivedEdges;
  export let key;
  export let initialZoom;
  export let initialLocation;
  export let minimap;
  // here we lookup the store using the unique key
  const svelvetStore = findOrCreateStore(key);
  // svelvetStore.isLocked.set(true)
  const { nodeSelected, backgroundStore, movementStore, widthStore, heightStore, d3Scale, isLocked} = svelvetStore;
  // declaring the grid and dot size for d3's transformations and zoom
  const gridSize = 15;
  const dotSize = 10;
  let d3Translate = {x: 0, y: 0, k:1};
  function zoomInit() {
    //d3Scale.set(e.transform.k);
    //set default zoom logic
      d3.select(`.Edges-${key}`)
      //makes sure translation is default at center coordinates
      .transition().duration(0)
      .call(d3Zoom.translateTo, 0, 0)
      //moves camera to coordinates
      .transition().duration(0)
      .call(d3Zoom.translateTo, initialLocation.x, initialLocation.y)
      //zooms in on selected point
      .transition().duration(0)
      .call(d3Zoom.scaleBy, Number.parseFloat(.4 + (.16*initialZoom)).toFixed(2))

      d3Translate = d3.zoomIdentity.translate(initialLocation.x, initialLocation.y).scale(Number.parseFloat(.4 + (.16*initialZoom)).toFixed(2));
      console.log(d3Translate)

      d3.select(`.Nodes-${key}`)
      .transition().duration(0)
      .call(d3Zoom.translateTo, 0, 0)
      .transition().duration(0)
      .call(d3Zoom.translateTo, initialLocation.x, initialLocation.y)
      .transition().duration(0)
      .call(d3Zoom.scaleBy, Number.parseFloat(.4 + (.16*initialZoom)).toFixed(2))
      
      //sets D3 scale to current k of object
      d3Scale.set(d3.zoomTransform(d3.select(`.Nodes-${key}`)).k)
  }
  
  onMount(() => {
      d3.select(`.Edges-${key}`).call(d3Zoom);
      d3.select(`.Nodes-${key}`).call(d3Zoom);
      zoomInit()
  });
  // TODO: Update d3Zoom type (refer to d3Zoom docs)
  let d3Zoom = d3
      .zoom()
      .filter(() => !$nodeSelected)
      .scaleExtent([0.4, 2])
      .on('zoom', handleZoom);
  // function to handle zoom events - arguments: d3ZoomEvent
  function handleZoom(e) {
      if (!$movementStore)
          return;
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
      d3Translate = transform;
      console.log(d3Translate)
      // selects and transforms all node divs from class 'Node' and performs transformation
      d3.select(`.Node-${key}`)
          .style('transform', 'translate(' + transform.x + 'px,' + transform.y + 'px) scale(' + transform.k + ')')
          .style('transform-origin', '0 0');
  }

  // if(locked === 'true') {
  //   document.querySelector('.Nodes').style.poin
  // }
  console.log('isLocked from GV', $isLocked);
  console.log('width from GV', $widthStore);
  </script>
  
  <!-- This is the container that holds GraphView and we have disabled right click functionality to prevent a sticking behavior -->
{#if minimap}
  <Minimap {key} {minimap} {d3Translate}/>
{/if}
<div class={`Nodes Nodes-${key}`} on:contextmenu|preventDefault>
  <!-- This container is transformed by d3zoom -->
  <div class={`Node Node-${key}`}>
    {#each $nodesStore as node}
      <!-- <EditModal {node} {key} /> -->
      <!-- {#if node.image && !node.data.label} -->
        <!-- <ImageNode {node} {key} /> -->
        <!-- If node has html property:  -->
      {#if node.data.html}
        <Node {node} {key} >{@html node.data.html}</Node> <!-- Directly render HTML inside of Node Component  -->
        <!-- If node has 'custom' property: -->
      {:else if node.data.custom}
      <!-- Render custom svelte component -->
        <Node {node} {key} > <svelte:component this={node.data.custom}/> </Node>
      {:else}
        <Node {node} {key} >{node.data.label}</Node>
      {/if}
    {/each}
  </div>
</div>


<svg class={`Edges Edges-${key}`} viewBox="0 0 {$widthStore} {$heightStore}" >
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
      <!-- {#if !edge.noHandle}
        <EdgeAnchor x={edge.sourceX} y={edge.sourceY} {key} />
        {#if !edge.arrow}
          <EdgeAnchor x={edge.targetX} y={edge.targetY} {key} />
        {/if}
      {/if} -->
    {/each}
  </g>
</svg>


<!-- rendering dots on the background depending on the zoom level -->


<style>
    .Nodes {
    position: absolute; 
    width: 100%;
    height: 100%;
    cursor: grab;
  } 
  
  .Nodes:active {
    cursor: grabbing;
  }
  :global(.hidden) {
    display: none;
    opacity: 0;
  }
  /* .Node {
    color: black; 
    width: 100%;
    height: 100%;
  } */ 
</style>
