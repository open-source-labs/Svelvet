<script>
  import { findOrCreateStore } from '../stores/store';
  import {onMount} from 'svelte';
  import EdgeAnchor from '../Edges/EdgeAnchor.svelte';
  export let node;
  export let key;
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
    nodesStore,
    isLocked
  } = findOrCreateStore(key);
  $: shouldMove = moving && $movementStore;
  // $nodeSelected is a store boolean that lets GraphView component know if ANY node is selected
  // moving local boolean specific to node selected, to change position of individual node once selected
  let moving = false;
  let moved = false;
  // console.log('nodesStore from Nodes', $nodesStore);

  // modal for editing nodes
  const openEditModal = (e) => {
    e.preventDefault();
    document.querySelector('.edit-node-modal').style.display = 'flex';
  }

  ////////// ------------- MOVED TO STORE ------------- ////////////
  // // Getting the styles for a custom class, and adjusting the height and width if necessary
  // const getStyles = (e, node) => {
  //   console.log('getStyles node', node);
  //   const styleRules = document.styleSheets[1].cssRules; // getting the right stylesheet and cssRules from the CSS object model
    
  //   // Look through each CSS rule to find the one the user defined
  //   Object.values(styleRules).forEach(rule => {
  //     if (rule.selectorText === `.${node.className}`) {
  //       const initialText = rule.cssText; // getting the full text of the CSS rule 
  //       const i = initialText.indexOf('{'); // finding index of first bracket
  //       const innerText = initialText.substring(i + 1, initialText.length - 1); // extracting the CSS to insert into inline style
  //       customCssText += innerText; // add the text to our variable which is included in inline styles
  //       // Adjusting the width and height if they are set via the custom class
  //       const arr = innerText.split(' ');
  //       arr.forEach((str, i) => {
  //         if (str === 'width:') {
  //           nodeWidth = str.concat(arr[i+1]); // go through the array and join width and the number
  //           const w = parseInt(arr[i+1]); // getting the number for the width
  //           nodeWidth = w;
  //         }
  //         if (str === 'height:') {
  //           nodeHeight = str.concat(arr[i+1]); // same as with the width
  //           const h = parseInt(arr[i+1]);
  //           nodeHeight = h;
  //         }
  //       })
  //     }
  //   })
  //   // adjusting the properties on the node in the store 
  //   const newStore = $nodesStore.map(n => {
  //     if (node.id === n.id) {
  //       n.width = nodeWidth || node.width;
  //       n.height = nodeHeight || node.height;
  //       return n;
  //     } else return n;
  //   })
  //   store.nodesStore.set(newStore);
  // }
  ////////////////////////////////////////////////////////////////////////////

  const editText = (e, node) => {
    
  }

  onMount((e) => {
    if (node.className) {
      const [width, height, innerText] = getStyles(e, node);
      nodeWidth = width;
      nodeHeight = height;
      customCssText += innerText;
    }
  })
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
      <!-- {#if node.clickCallback}
        <button on:click={(e) => {onNodeClick(e, node.id)}}>Click Me</button>
        {/if} -->
    {:else if node.data.label}
    <div contenteditable="true">
      <p class="node-label" on:dblclick={(e) => {editText(e, node)}}>{node.data.label}</p>      
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
    z-index: 3;
    transform-style: preserve-3d;
  }
  
  .Node:hover {
    box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.4);
  }

  .node-label:hover {
    cursor: text;
  }
</style>
