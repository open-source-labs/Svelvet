<script lang="ts">
  import { getNodes, getAnchors, findStore } from '$lib/controllers/storeApi';
  import { TemporaryEdge } from '$lib/models/TemporaryEdge';
  import type {
    NodeType,
    EdgeType,
    AnchorType,
    StoreType,
    UserNodeType,
    UserEdgeType,
    TemporaryEdgeType,
    PotentialAnchorType,
  } from '$lib/models/types';
  import { beforeUpdate, afterUpdate } from 'svelte';
  export let canvasId;
  export let x;
  export let y;
  export let potentialAnchor: PotentialAnchorType;

  let newEdge;
  let hovered = false;
  let anchorWidth = 8;
  let anchorHeight = 8;

  const { temporaryEdgeStore } = findStore(canvasId);
  let moving = false;
  let moved = false;
  let edgeShouldMove = false;
  // $: store = findStore(canvasId);

  let mouseX = x;
  let mouseY = y;

  import { v4 as uuidv4 } from 'uuid';
</script>

<svelte:window
  on:mousemove={(e) => {
    e.preventDefault();
    if (edgeShouldMove) {
      temporaryEdgeStore.update((edges) => {
        if (edges.length === 0) {
          const newTempEdge = new TemporaryEdge(
            uuidv4(),
            potentialAnchor.nodeId,
            mouseX,
            mouseY,
            null,
            mouseX,
            mouseY,
            canvasId,
            'straight',
            'black'
          );
          return [newTempEdge];
        } else if (edges.length === 1) {
          const edge = edges[0];
          edge.targetX += e.movementX;
          edge.targetY += e.movementY;
        } else {
          throw `there should only be zero or one temporary edge at any given time`;
        }
        return [...edges];
      });
    }
  }}
  on:mouseup={(e) => {
    edgeShouldMove = false; // prevent the new edge from moving
    temporaryEdgeStore.update((edges) => {
      return [];
    });
  }}
/>

<div
  on:mousedown={(e) => {
    e.preventDefault();
    e.stopPropagation(); // Important! Prevents the event from firing on the parent element (the .Nodes div)
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
