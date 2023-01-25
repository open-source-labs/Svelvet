<script lang="ts">
  import { findStore } from '$lib/controllers/storeApi';
  import type {
    NodeType,
    EdgeType,
    AnchorType,
    StoreType,
    UserNodeType,
    UserEdgeType,
  } from '$lib/models/types';
  // import { id } from 'src/playgroundStore';

  import EditNode from './EditNode.svelte';
  import { writable, derived, get, readable } from 'svelte/store';

  export let nodeId: string;
  export let canvasId: string;

  const store = findStore(canvasId);
  // const { nodesStore, edgesStore, anchorsStore, nodeSelected } = store;

  //isEditing will be set to true when user right click on the node
  $: isEditing = false;

  const {
    nodesStore,
    edgesStore,
    anchorsStore,
    nodeSelected,
    resizeNodesStore,
  } = store;

  let isSelected = false;
  let node: NodeType;
  $: node = $nodesStore[nodeId];
</script>

<svelte:window
  on:mousemove={(e) => {
    e.preventDefault();
    if (isSelected) {
      nodesStore.update((nodes) => {
        const node = nodes[nodeId];
        node.setPosition(e.movementX, e.movementY);
        return { ...nodes };
      });
    }
  }}
  on:mouseup={(e) => {
    e.preventDefault();
    $nodeSelected = false; // tells other components that node is no longer being clicked. This is so d3 is inactive during node movement.
    isSelected = false;

    // TODO: fix the TS error
    if (get(store.options).snap) {
      // If user sets snap attribute as true inside Svelvet
      const snapResize = get(store.options).snapTo;
      const x = Math.floor(node.positionX / snapResize) * snapResize;
      const y = Math.floor(node.positionY / snapResize) * snapResize;
      console.log('!', x, y);
    }
  }}
/>

<!--EditNode component will be displayed if isEditing is true-->
{#if isEditing}
  <EditNode {canvasId} {nodeId}/>
{/if}

<div
  on:mousedown={(e) => {
    e.preventDefault();
    $nodeSelected = true; // when $nodeSelected = true, d3 functionality is disabled
    isSelected = true;
  }}
  on:contextmenu={(e) => {
    e.preventDefault();
    node = $nodesStore[nodeId];
    $nodeSelected = true; // when $nodeSelected = true, d3 functionality is disabled
    isSelected = false;
    isEditing = isEditing === true ? false : true;
  }}
  class="Node"
  style="left: {node.positionX}px;
    top: {node.positionY}px;
    width: {node.width}px;
    height: {node.height}px;
    background-color: {node.bgColor};
    border-color: {node.borderColor};
    border-radius: {node.borderRadius}px;
    color: {node.textColor};"
  id="svelvet-{node.id}"
>

  <!-- This executes if node.image is present without node.label -->
  {#if node.image}
    <img
      src={node.src}
      alt=""
      style="width: {node.width * 0.75}px;
			 height: {node.height * 0.75}px;
       overflow: hidden;"
    />
  {/if}
  <slot />
</div>

<style>
  .Node {
    position: absolute;
    display: grid;
    user-select: none;
    cursor: move;
    justify-content: center;
    overscroll-behavior: auto;
    align-items: center;
    font-size: 14px;
    text-align: center;
    border: solid 1px black;
    border-radius: 5px;
    box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.2);
  }
</style>
