<script>
  import { getNodes, getAnchors, findStore } from '$lib/controllers/storeApi';

  import { beforeUpdate, afterUpdate } from 'svelte';
  export let canvasId;
  export let x;
  export let y;

  let newEdge;
  let hovered = false;
  let anchorWidth = 8;
  let anchorHeight = 8;

  // const {
  //   nodesStore,
  //   onEdgeMove,
  //   setAnchorPosition,
  //   renderEdge,
  //   renderNewNode,
  //   hoveredElement,
  //   derivedEdges,
  //   nodeLinkStore,
  //   nodeCreateStore,
  // } = findStore(canvasId);
  let moving = false;
  let moved = false;
  let edgeShouldMove = false;
  $: store = findStore(canvasId);
</script>

<div
  class="Anchor"
  style={`
      height:${anchorHeight}px;
      width:${anchorWidth}px;
      top: ${y - anchorHeight / 2}px;
      left:${x - anchorWidth / 2}px;
    `}
/>

<style>
  .Anchor {
    position: absolute;
    border-radius: 50%;
    cursor: crosshair;
    background-color: rgb(105, 99, 99);
  }

  .Anchor:hover {
    transform: scale(1.8) translateZ(-10px);
    background-color: #ff4742;
    box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.2);
  }
</style>
