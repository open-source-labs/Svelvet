<script>
  import { afterUpdate, onMount } from 'svelte';
  import { zoom, zoomTransform, zoomIdentity } from 'd3-zoom';
  import { select, selectAll, pointer, local } from 'd3-selection';
  import SimpleBezierEdge from '../../Edges/SimpleBezierEdge.svelte';
  import StraightEdge from '../../Edges/StraightEdge.svelte';
  import SmoothStepEdge from '../../Edges/SmoothStepEdge.svelte';
  import StepEdge from '../../Edges/StepEdge.svelte';
  import EditModal from '../../Nodes/EditModal.svelte';
  import MinimapBoundless from '../Minimap/MinimapBoundless.svelte';
  import Node from '../../Nodes/index.svelte';
  import { findOrCreateStore } from '../../stores/store';
  import MinimapBoundary from '../Minimap/MinimapBoundary.svelte';

  //these are typscripted as any, however they have been transformed inside of store.ts
  export let nodesStore;
  export let derivedEdges;
  export let key;
  export let initialZoom;
  export let initialLocation;
  export let minimap;
  export let width;
  export let height;
  export let boundary;

  // here we lookup the store using the unique key
  const {
    nodeSelected,
    backgroundStore,
    movementStore,
    widthStore,
    heightStore,
    d3Scale,
    isLocked,
    shareable,
  } = svelvetStore;
  // declare prop to be passed down to the minimap
  let d3Translate = { x: 0, y: 0, k: 1 };
  //creating function to pass down
</script>

<div id="graphview-container">
  <!-- This is the container that holds GraphView and we have disabled right click functionality to prevent a sticking behavior -->
  {#if minimap && boundary}
    <MinimapBoundary on:message={miniMapClick} {key} {boundary} {d3Translate} />
  {:else if minimap}
    <MinimapBoundless on:message={miniMapClick} {key} {d3Translate} />
  {/if}
  <EditModal {key} />
  <div
    class={`Nodes Nodes-${key}`}
    on:contextmenu|preventDefault
    on:click={closeEditModal}
    on:keydown={() => {
      return;
    }}
  >
    <!-- This container is transformed by d3zoom -->
    <div class={`Node Node-${key}`}>
      {#each $nodesStore as node (node.id)}
        <!-- If node has html property:  -->
        {#if node.data.html}
          <Node {node} {key}>{@html node.data.html}</Node>
          <!-- Directly render HTML inside of Node Component  -->
          <!-- If node has 'custom' property: -->
        {:else if node.data.custom}
          <!-- Render custom svelte component -->
          <Node {node} {key}><svelte:component this={node.data.custom} /></Node>
        {:else}
          <Node {node} {key}>{node.data.label}</Node>
        {/if}
      {/each}
    </div>
  </div>

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
      {#each $derivedEdges as edge (edge.id)}
        {#if edge.type === 'straight'}
          <StraightEdge {edge} />
        {:else if edge.type === 'smoothstep'}
          <SmoothStepEdge {edge} />
        {:else if edge.type === 'step'}
          <StepEdge {edge} />
        {:else}
          <SimpleBezierEdge {edge} />
        {/if}
      {/each}
    </g>
  </svg>

  {#if $shareable}
    <!-- this is for the download button and upload input field -->
    <div id="export-import">
      <a id="downloadState-{key}" download="svelvet-state.json"
        ><svg
          id="dwnldimg"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          fill="#000000"
          ><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
            id="SVGRepo_iconCarrier"
          >
            <path d="M0 0h48v48H0z" fill="none" />
            <g id="Shopicon">
              <polygon points="22,4 22,20 14,20 24,30 34,20 26,20 26,4 " />
              <path
                d="M8,44h32c2.206,0,4-1.794,4-4V30h-4v10H8V30H4v10C4,42.206,5.794,44,8,44z"
              />
            </g>
          </g></svg
        ></a
      >
      <input type="text" id="store-input" placeholder="Paste JSON here" />
      <button id="store-input-btn" on:click={uploadStore}>Upload</button>
    </div>
  {/if}
</div>

<!-- rendering dots on the background depending on the zoom level -->
<style>
  #graphview-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .Nodes {
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: grab;
    /* pointer-events: none; */
  }
  .Edges {
    height: 100%;
    width: 100%;
  }
  .Nodes:active {
    cursor: grabbing;
  }

  #dwnldimg {
    width: 1.5rem;
    margin-right: 0.1rem;
  }

  #store-input,
  #store-input-btn {
    height: 1.5rem;
    border-radius: 0.3rem;
    font-size: 0.7rem;
    margin: 2px;
  }

  #store-input-btn:hover {
    cursor: pointer;
    background-color: #ff4742;
    color: white;
    box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.2);
  }

  #export-import {
    position: absolute;
    left: 10px;
    bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
</style>
