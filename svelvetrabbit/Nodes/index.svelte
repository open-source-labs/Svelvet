<script>
  import { findOrCreateStore } from '../stores/store';
  import {onMount, afterUpdate} from 'svelte';
  import EdgeAnchor from '../Edges/EdgeAnchor.svelte';
  import EditModal from './EditModal.svelte';
  export let node;
  export let key;
  let customCssText = '';
  let nodeWidth;
  let nodeHeight;
  $: thisNode = node;
  const {
    onNodeMove,
    onNodeClick,
    onTouchMove,
    nodeSelected,
    nodeIdSelected,
    movementStore,
    snapgrid, 
    snapResize,
    nodesStore,
    derivedEdges,
    doubleClickedNode
  } = findOrCreateStore(key);
  $: shouldMove = moving && $movementStore;
  $: store = findOrCreateStore(key);
  $: {
    console.log($nodesStore.filter(n => n.id === node.id)[0]);
  }
  // console.log(thisNode);
  // $nodeSelected is a store boolean that lets GraphView component know if ANY node is selected
  // moving local boolean specific to node selected, to change position of individual node once selected
  let moving = false;
  let moved = false;
  console.log('nodesStore from Nodes', $nodesStore);

  // modal for editing nodes
  const openEditModal = (e) => {
    e.preventDefault();
    document.querySelector('.edit-node-modal').style.display = 'flex';
  }
  
  // Getting the styles for a custom class, and adjusting the height and width if necessary
  const getStyles = (e, node) => {
    const styleRules = document.styleSheets[1].cssRules; // getting the right stylesheet and cssRules from the CSS object model
    
    Object.values(styleRules).forEach(rule => {
      if(rule.selectorText === `.${node.className}`) {
        const initialText = rule.cssText;
        const i = initialText.indexOf('{');
        const innerText = initialText.substring(i + 1, initialText.length - 1);
        customCssText += innerText;
        const arr = innerText.split(' ');
        // Adjusting the width and height if they are set via the custom class
        arr.forEach((str, i) => {
          if (str === 'width:') {
            nodeWidth = str.concat(arr[i+1]); // go through the array and join width and the number
            const w = parseInt(arr[i+1]); // getting the number for the width
            thisNode.width = w;
          }
          if (str === 'height:') {
            nodeHeight = str.concat(arr[i+1]); // same as with the width
            const h = parseInt(arr[i+1]);
            // const h = parseInt(nodeHeight.match(/\d+/g)[0])
            thisNode.height = h;
          }
        })
        console.log('node from Nodes', node);
      }
    })
     const newStore = $nodesStore.map(n => {
      if (node.id === n.id) {
        n.width = thisNode.width;
        n.height = thisNode.height;
        return n;
      } else return n;
     })
     console.log($nodesStore);
     console.log(newStore);
     store.nodesStore.set(newStore);
  }

  onMount((e) => {
    if (node.className) getStyles(e, node);
  })
  // afterUpdate((e) => {
  //   if (node.className) getStyles(e, node);
  // })
  // console.log('thisNode', thisNode);
</script>

<svelte:window

  on:mousemove={(e) => {
    e.preventDefault();
    if (shouldMove) {
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
  on:click={(e) => console.log(node)}

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

on:dblclick={(e) => {
  e.preventDefault();
  $nodeSelected = true;
  $nodeIdSelected = node.id;
  doubleClickedNode(e, node.id);
}}

  class="Node {node.className || ''}"
  
  style="left: {node.position.x}px;
    top: {node.position.y}px;
    width: {thisNode.width || node.width}px;
    height: {thisNode.height || node.height}px;
    background-color: {node.bgColor};
    border-color: {node.borderColor};
    border-radius: {node.borderRadius}px;
    color: {node.textColor};
    {customCssText}"

  id="svelvet-{node.id}"
>

<!-- this anchor is the target-->
  <EdgeAnchor {key} node={thisNode} {nodeWidth} {nodeHeight} position={node.targetPosition || 'top'} role={'target'} />
  <EditModal {node} {key} /> 
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
    <!-- {#if node.clickCallback}
      <button on:click={(e) => {onNodeClick(e, node.id)}}>Click Me</button>
    {/if} -->
    <slot />
    <!-- this anchor is the source-->
    <EdgeAnchor {key} node={thisNode} {nodeWidth} {nodeHeight} position={node.sourcePosition || 'bottom'} role={'source'} />

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
    z-index: 3;
    transform-style: preserve-3d;
  }
</style>
