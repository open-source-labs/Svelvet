<script>
  import { findOrCreateStore } from '../stores/store';
  import {afterUpdate} from 'svelte';
  import EdgeAnchor from '../Edges/EdgeAnchor.svelte';

  export let node;
  export let key;
  // Lines 9-11 are related to node custom classes
  let customCssText = '';
  let nodeWidth;
  let nodeHeight;
  
  const {
    onNodeMove,
    onNodeClick,
    onTouchMove,
    getStyles,
    nodeSelected,
    nodeIdSelected,
    movementStore,
    snapgrid, 
    snapResize,
    isLocked,
    nodeEditStore
  } = findOrCreateStore(key);
  $: shouldMove = moving && $movementStore;
  // $nodeSelected is a store boolean that lets GraphView component know if ANY node is selected
  // moving local boolean specific to node selected, to change position of individual node once selected
  let moving = false;
  let moved = false;
  let label;

  $: label = node.data.label;
  
  const showEditModal = (e, node) => {
    e.preventDefault();
    $nodeIdSelected = node.id;
    const input = document.querySelector('.edit-modal');
    input.style.display = 'flex';
  };

  afterUpdate((e) => {
    if (node.className) {
      const [width, height, innerText] = getStyles(e, node);
      nodeWidth = width;
      nodeHeight = height;
      customCssText = innerText;
    }
  });

</script>

<svelte:window

  on:mousemove={(e) => {
    e.preventDefault();
    if (shouldMove && !$isLocked) {
      onNodeMove(e, node.id);
      moved = true;
    }
  }}

  on:mouseup={(e) => {
    // Note: mouseup moved outside of div to prevent issue where node becomes magnetized to cursor after leaving visible boundaries, github issues #120 & #125
    if ($snapgrid) {
      // If user sets snap attribute as true inside Svelvet
      node.position.x = Math.floor(node.position.x / $snapResize) * $snapResize;
      node.position.y = Math.floor(node.position.y / $snapResize) * $snapResize;
      // Invoking on mouseMove so that edges update relation to node immediately upon snap 
      onNodeMove(e, node.id);
    }
    moving = false;
    $nodeSelected = false;
    if (!moved && node.id == $nodeIdSelected) {
      onNodeClick(e, node.id);
    }
    moved = false;
  }}

/>

<div
  on:contextmenu={(e) => {
    if ($nodeEditStore) showEditModal(e, node);
  }}

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
  
  on:keydown={() => {return}}


  class="Node {node.className || ''}"
  
  style="left: {node.position.x}px;
    top: {node.position.y}px;
    width: {nodeWidth || node.width}px;
    height: {nodeHeight || node.height}px;
    background-color: {node.bgColor};
    border-color: {node.borderColor};
    border-radius: {node.borderRadius}px;
    color: {node.textColor};
    {customCssText}"

  id="svelvet-{node.id}"
>

<!-- this anchor is the target-->
  <EdgeAnchor {key} {node} width={nodeWidth || node.width} height={nodeHeight || node.height} position={node.targetPosition || 'top'} role={'target'} /> 
    <!-- This executes if node.image is present without node.label -->
    {#if node.image}
      <img
        src={node.src}
        alt=""
        style="width: {node.width * 0.85}px;
         height: {node.height * 0.85}px;
         overflow: hidden;"
      />
    {:else if node.data.label}
      <div>
        <p> {node.data.label}</p>   
      </div>
    {:else}
      <div>
        <slot />
      </div>
    {/if}
    <!-- this anchor is the source-->
    <EdgeAnchor {key} {node} width={nodeWidth || node.width} height={nodeHeight || node.height} position={node.sourcePosition || 'bottom'} role={'source'} />
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
    transform-style: preserve-3d;
    color: black;
  }
  
  .Node:hover {
    box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.4);
  }
</style>
