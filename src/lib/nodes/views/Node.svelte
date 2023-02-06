<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';

  import { findStore } from '../../store/controllers/storeApi';
  import type {
    NodeType,
    EdgeType,
    StoreType,
    UserNodeType,
    UserEdgeType,
  } from '../../store/types/types';

  import EditNode from './EditNode.svelte';
  import { writable, derived, get, readable } from 'svelte/store';
  import { forceCssHeightAndWidth } from '../../customCss/controllers/getCss';
  import { toggleExpandAndCollapse } from '$lib/collapsible/controllers/util';

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

  // this state variable is used for "clickCallback" functionality
  // on mouseup, the callback will fire only if userClick is true
  // isUserClick is set to true on mousedown, but set back to false in two cases
  //   (1) if the mouse moves, meaning that the node is being dragged
  //   (2) if the mouse leaves the node
  let isUserClick = false;

  //
  const mousedown = (e) => {
    e.preventDefault();
    // part of the "clickCallback" feature
    isUserClick = true;
    // part of the "collapsible" feature
    toggleExpandAndCollapse(store, nodeId);
    // when $nodeSelected = true, d3 functionality is disabled. The prevents panning while the node is being dragged
    $nodeSelected = true;
    isSelected = true;
  };
  const rightclick = (e) => {
    e.preventDefault();
    node = $nodesStore[nodeId];
    $nodeSelected = true; // when $nodeSelected = true, d3 functionality is disabled
    isSelected = false;
    isEditing = isEditing === true ? false : true;
  };
  const mouseleave = (e) => {
    // part of the "clickCallback" feature
    isUserClick = false;
    // re-enables d3 when mouse leaves node
    $nodeSelected = false;
  };
  const mouseenter = (e) => {
    // disables d3 when mouse enters node
    nodeSelected.set(true);
  };
  const mousemove = (e) => {
    e.preventDefault();
    // part of the "clickCallback" feature
    isUserClick = false;
    // part of the "drag node" feature
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
  };

  const touchmove = (e) => {
    // part of the "clickCallback" feature
    isUserClick = false;
    // part of the "drag node" feature
    if (isSelected) {
      nodesStore.update((nodes) => {
        const node = nodes[nodeId];
        const { x, y, width, height } = e.target.getBoundingClientRect();
        const offsetX =
          ((e.touches[0].clientX - x) / width) * e.target.offsetWidth;
        const offsetY =
          ((e.touches[0].clientY - y) / height) * e.target.offsetHeight;

        const d3Scale = get(store.d3Scale);
        // divide the movement value by scale to keep it proportional to d3Zoom transformations
        node.setPositionFromMovement(
          offsetX - node.width / 2,
          offsetY - node.height / 2
        );
        return { ...nodes };
      });
    }
  };

  const mouseup = (e) => {
    e.preventDefault();
    isSelected = false;
    // this implements the "clickCallback" feature
    if (node.clickCallback && isUserClick) node.clickCallback(node);

    // This implements the "snap to grid" feature
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
  };
</script>

<svelte:window
  on:mousemove={mousemove}
  on:mouseup={mouseup}
  on:touchmove={touchmove}
  on:touchend={mouseup}
/>

<!--EditNode component will be displayed if isEditing is true-->
{#if isEditing}
  <EditNode {canvasId} {nodeId} {isEditing} />
{/if}

<!-- on:wheel prevents page scroll when using mousewheel in the Node -->
<div
  on:mouseleave={mouseleave}
  on:mousedown={mousedown}
  on:contextmenu={rightclick}
  on:touchstart={mousedown}
  on:mouseenter={mouseenter}
  on:wheel={(e) => e.preventDefault()}
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
    pointer-events: auto; /* this is needed for pointer events to work since we disable them in graphview */
  }
</style>
