<script lang="ts">
  import { getNodes, getAnchors, findStore } from '$lib/controllers/storeApi';
  import { TemporaryEdge } from '$lib/models/TemporaryEdge';
  import { writable, derived, get, readable } from 'svelte/store';

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
  export let temporaryEdges;

  let newEdge;
  let hovered = false;
  let anchorWidth = 8;
  let anchorHeight = 8;

  const { temporaryEdgeStore } = findStore(canvasId);
  let moving = false;
  let moved = false;
  let edgeShouldMove = false;
  const store = findStore(canvasId);

  let mouseX = x;
  let mouseY = y;
  // whether the mouse is hovering over the potential anchor
  // determines behavior of releasing the click; if the click is
  // hovering over an anchor then an edge is created then temporary edges
  // aer cleared, otherwise the temporary edges are cleared
  let mouseHover = false;
  import { v4 as uuidv4 } from 'uuid';
</script>

<svelte:window
  on:mousemove={(e) => {
    // imelements drawing an (temporary) edge from a potential anchor to the mouse cursor
    e.preventDefault();
    if (edgeShouldMove) {
      temporaryEdgeStore.update((edges) => {
        if (edges.length === 0) {
          // say there are no temporary edges. This means the user just clicked on the potential anchor
          // so the current mouse position = temporary anchor position = mouseX, mouseY
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
          const d3Scale = get(store.d3Scale);
          edge.targetX += e.movementX / d3Scale;
          edge.targetY += e.movementY / d3Scale;
        } else {
          throw `there should only be zero or one temporary edge at any given time`;
        }
        return [...edges];
      });
    }
  }}
  on:mouseup={(e) => {
    console.log('!!', $temporaryEdgeStore.length);
    console.log('!!!', temporaryEdges.length);

    edgeShouldMove = false; // prevent the new edge from moving
    temporaryEdgeStore.update((edges) => {
      if (mouseHover) console.log('!', edges.length);
      if (mouseHover && edges.length > 0) {
        if (edges.length !== 1)
          throw `there should be exactly one temporary edge`;
        const tempEdge = edges[0];
        console.log('creating new edge');
        console.log(tempEdge);
        return [];
      } else {
        return [];
      }
    });
  }}
/>

<div
  on:mouseenter={(e) => {
    // mouseHover is used to decide whether to create a new edge/node
    mouseHover = true;
  }}
  on:mouseleave={(e) => {
    // mouseHover is used to decide whether to create a new edge/node
    mouseHover = false;
  }}
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
