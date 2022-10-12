<script>import { findOrCreateStore } from '../stores/store';
export let node;
export let key;
const { onMouseMove, onNodeClick, onTouchMove, nodeSelected, nodeIdSelected, movementStore, snapgrid } = findOrCreateStore(key);
$: shouldMove = moving && $movementStore;
// $nodeSelected is a store boolean that lets GraphView component know if ANY node is selected
// moving local boolean specific to node selected, to change position of individual node once selected
let moving = false;
let moved = false;
</script>

<svelte:window
  on:mousemove={(e) => {
    e.preventDefault();
    if (shouldMove) {
      onMouseMove(e, node.id);
      moved = true;
    }
  }}
/>

<div
  on:touchmove={(e) => {
    if (shouldMove) {
      onTouchMove(e, node.id);
    }
  }}
  on:touchstart={(e) => {
    e.preventDefault();
    moving = true;
    $nodeSelected = true;
  }}
  on:touchend={(e) => {
    moving = false;
    $nodeSelected = false;
  }}
  on:mousedown={(e) => {
    e.preventDefault();
    moving = true;
    $nodeIdSelected = node.id;
    $nodeSelected = true;
  }}
  on:mouseup={(e) => {

    if ($snapgrid) {
      node.position.x = Math.floor(node.position.x/30) * 30
      node.position.y = Math.floor(node.position.y/30) * 30
    }
    moving = false;
    $nodeSelected = false;
    if (!moved && node.id == $nodeIdSelected) {
      onNodeClick(e, node.id);
    }
    moved = false;
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
