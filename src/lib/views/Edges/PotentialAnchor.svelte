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

  let path;
  let mouseX = x;
  let mouseY = y;
  $: {
    path = `M ${x},${y}L ${mouseX},${mouseY}`;
    console.log(path);
  }
</script>

<svelte:window
  on:mousemove={(e) => {
    e.preventDefault();
    if (edgeShouldMove) {
      mouseX += e.movementX;
      mouseY += e.movementY;
      // onEdgeMove(e, newEdge.id); // re-renders (moves) the edge while the mouse is down and moving
    }
  }}
/>

<div
  on:mousedown={(e) => {
    e.preventDefault();
    e.stopPropagation(); // Important! Prevents the event from firing on the parent element (the .Nodes div)
    console.log('clicked anchor');
    edgeShouldMove = true;
  }}
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
