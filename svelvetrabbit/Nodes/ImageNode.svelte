<script>import { findOrCreateStore } from '../stores/store';
export let node;
export let key;
const { onNodeMove, onNodeClick, onTouchMove, nodeSelected, nodeIdSelected } = findOrCreateStore(key);
// $nodeSelected is a store boolean that lets GraphView component know if ANY node is selected
// moving local boolean specific to node selected, to change position of individual node once selected
let moving = false;
let moved = false;
//This is a modified Node Component that is formated to fill the entire space of the div to fit the image and does not allow for a label
</script>

<svelte:window
  on:mousemove={(e) => {
    e.preventDefault();
    if (moving) {
      onNodeMove(e, node.id);
      moved = true;
    }
  }}
/>
<div class="image-node">
  
</div>
<img
  on:touchmove={(e) => {
    if (moving) {
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
  src={node.src}
  alt={node.alt}
  id="svelvet-{node.id}"
/>
<slot />

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
