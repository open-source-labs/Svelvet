<script lang="ts">
  import { onMouseMove, nodeSelected } from '$lib/stores/store';
  import type { Node } from '$lib/types/types';

  export let node: Node;

  // $nodeSelected is a store boolean that lets GraphView component know if ANY node is selected
  // moving local boolean specific to node selected, to change position of individual node once selected
  let moving = false;
</script>

<svelte:window
  on:mouseup={() => {
    moving = false;
    $nodeSelected = false;
  }}
  on:mousemove={(e) => {
    if (moving) onMouseMove(e, node.id);
  }}
/>

<div
  on:mousedown={() => {
    moving = true;
    $nodeSelected = true;
  }}
  class="Node"
  style="left: {node.position.x}px; 
    top: {node.position.y}px; 
    width: {node.width}px; 
    height: {node.height}px; 
    background-color: {node.bgColor}; 
    border-color: {node.borderColor}; 
    border-radius: {node.borderRadius}px;
    color: {node.textColor};"
>
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
