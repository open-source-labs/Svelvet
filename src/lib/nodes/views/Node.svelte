<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';

  import { findStore } from '$lib/store/controllers/storeApi';
  import type {
    NodeType,
    EdgeType,
    AnchorType,
    StoreType,
    UserNodeType,
    UserEdgeType,
  } from '$lib/store/types/types';

  import EditNode from './EditNode.svelte';
  import { writable, derived, get, readable } from 'svelte/store';
  import { forceCssHeightAndWidth } from '$lib/customCss/controllers/getCss';

  export let node: NodeType;
  export let canvasId: string;
  // export let nodes: NodeType[];
  //   const nodeId = node.id; // this seems to go stale
  export let nodeId: string;

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

  // forceCssHeightAndWidth forces the size of the node to be defined by CSS
  afterUpdate(() => {
    if (node.className) forceCssHeightAndWidth(store, node);
  });
</script>

<svelte:window
  on:mousemove={(e) => {
    e.preventDefault();
    if (isSelected) {
      nodesStore.update((nodes) => {
        const node = nodes[nodeId];
        const d3Scale = get(store.d3Scale);
        // divide the movement value by scale to keep it proportional to d3Zoom transformations
        node.setPositionFromMovement(
          e.movementX / d3Scale,
          e.movementY / d3Scale
        );
        return { ...nodes };
      });
    }
  }}
  on:mouseup={(e) => {
    e.preventDefault();
    $nodeSelected = false; // tells other components that node is no longer being clicked. This is so d3 is inactive during node movement.
    isSelected = false;

    // This implements the "snap to grid" feature
    // TODO: fix the TS error
    if (get(store.options).snap) {
      // If user sets snap attribute as true inside Svelvet
      const snapResize = get(store.options).snapTo;
      const oldX = node.positionX;
      const oldY = node.positionY;
      const newX = Math.round(node.positionX / snapResize) * snapResize;
      const newY = Math.round(node.positionY / snapResize) * snapResize;

      nodesStore.update((nodes) => {
        const node = nodes[nodeId];
        node.setPositionFromMovement(newX - oldX, newY - oldY);
        return { ...nodes };
      });
    }
  }}
/>

<!--EditNode component will be displayed if isEditing is true-->
{#if isEditing}
  <EditNode {canvasId} {nodeId} {isEditing} />
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
  class="Node {node.className}"
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
