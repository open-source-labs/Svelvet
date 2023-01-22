<script lang="ts">
  import { findStore } from '$lib/controllers/storeApi';
  import type {
    NodeType,
    EdgeType,
    AnchorType,
    StoreType,
    TypeUserNode,
    TypeUserEdge,
  } from '$lib/models/types';
  export let node_id: string;
  export let canvasId: string;

  const store = findStore(canvasId);
  const { nodesStore, edgesStore, anchorsStore } = store;

  let isSelected = false;

  let node: NodeType;
  $: node = $nodesStore[node_id];
</script>

<svelte:window
  on:mousemove={(e) => {
    e.preventDefault();
    if (isSelected) {
      nodesStore.update((nodes) => {
        const node = nodes[node_id];
        node.setPosition(e.movementX, e.movementY);
        return { ...nodes };
      });
    }
  }}
  on:mouseup={(e) => {
    e.preventDefault();
    isSelected = false;
  }}
/>

<!-- // This is the function handler for the mouseMove event to update the position of the selected node.
const onMouseMove = (e: any, nodeID: number) => {
  coreSvelvetStore.nodesStore.update((n) => {
    n.forEach((node: Node) => {
      if (node.id === nodeID) {
        //retrieve d3Scale value from store
        const scale = get(coreSvelvetStore.d3Scale);
        // divide the movement value by scale to keep it proportional to d3Zoom transformations
        node.position.x += e.movementX / scale;
        node.position.y += e.movementY / scale;
      }
    });
    return [...n];
  });
}; -->

{JSON.stringify(node)}
<div
  on:mousedown={(e) => {
    e.preventDefault();
    isSelected = true;
  }}
  class="Node"
  style="left: {node.positionX}px;
    top: {node.positionY}px;
    width: {node.width}px;
    height: {node.height}px;
    background-color: {node.bgColor};
    border-color: {node.bgColor};
    border-radius: {5}px;
    color: white;"
  id="svelvet-{node_id}"
>
  HI IM TEXT
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
