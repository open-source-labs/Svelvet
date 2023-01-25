<script lang="ts">
  import Moveable from 'svelte-moveable';
  import { findStore } from '$lib/controllers/storeApi';
  import type {
    NodeType,
    EdgeType,
    AnchorType,
    StoreType,
  } from '$lib/models/types';
  export let nodeId: string;
  export let canvasId: string;

  const store = findStore(canvasId);
  const { nodesStore, edgesStore, anchorsStore } = store;

  let isSelected = false;
  let target;

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

<div
  on:mousedown={(e) => {
    e.preventDefault();
    isSelected = true;
  }}
  class="Node target"
  style="left: {node.positionX}px;
    top: {node.positionY}px;
    width: {node.width}px;
    height: {node.height}px;
    background-color: {node.bgColor};
    border-color: {node.bgColor};
    border-radius: {5}px;
    color: white;"
  id="svelvet-{nodeId}"
  bind:this={target}
/>

<Moveable
  {target}
  origin={true}
  edge={true}
  keepRatio={false}
  renderDirections={['nw', 'ne', 'sw', 'se', 'n', 'w', 's', 'e']}
  resizable={true}
  throttleResize={0}
  on:resizeStart={() => console.log('asdfasdfa')}
  on:resize={() => console.log('asdfasdfa')}
  on:resizeEnd={() => console.log('asdfasdfa')}
/>

<!--   function onDragStart({ target, set }) {
    const frame = getFrame(target);

    set([
    set([frame.get("transform", "scaleX"), frame.get("transform", "scaleY")]);
    dragStart && onDragStart(dragStart);
  } -->
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
