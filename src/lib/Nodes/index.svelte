<script lang="ts">
  import { findOrCreateStore } from '$lib/stores/store';
  import type { Node } from '$lib/types/types';
  import { logDOM } from '@testing-library/svelte';



  export let node: Node;
  export let key: string;

   const { onMouseMove, onNodeClick, onTouchMove, nodeSelected, nodeIdSelected } = findOrCreateStore(key);

  // $nodeSelected is a store boolean that lets GraphView component know if ANY node is selected
  // moving local boolean specific to node selected, to change position of individual node once selected
  let moving = false;
  let moved = false;

</script>

<svelte:window
  on:mousemove={(e) => {
    if (moving) {
      onMouseMove(e, node.id);
      moved = true;
    }
  }}

/>

<div
  on:touchmove={(e) => {
    if (moving){
     onTouchMove(e, node.id);
    }
  }}
  on:touchstart={(e) => {
    e.preventDefault();
    console.log('touchstart event--->', e)
    console.log('div location--->', e.target.getBoundingClientRect())
    moving = true;
    $nodeSelected = true;
  }}
  on:touchend={(e) => {
    moving =false
    $nodeSelected = false;
  }}
  on:mousedown={(e) => {
    console.log('mouse event-->', e)
    e.preventDefault(); //need this?
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
  class='Node'
  id={`${node.id}`}
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
  /* default we could just add 2 liner width and height, 175, 140 */
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

<!-- on:touchstart={(e)=>{
  alert('hello')
  // moving = true;
  // $nodeIdSelected = node.id;

  // onNodeClick(e, node.id);
  //  $nodeIdSelected = node.id;
  //  $nodeSelected = true;
}} -->