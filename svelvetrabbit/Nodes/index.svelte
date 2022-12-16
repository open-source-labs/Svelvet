<script>
  import { findOrCreateStore } from '../stores/store';
  import {afterUpdate} from 'svelte';
  import EdgeAnchor from '../Edges/EdgeAnchor.svelte';
  import EditModal from './EditModal.svelte';
  export let node;
  export let key;

  const {
    onNodeMove,
    onNodeClick,
    onTouchMove,
    nodeSelected,
    nodeIdSelected,
    movementStore,
    snapgrid, 
    snapResize,
    derivedEdges
  } = findOrCreateStore(key);
  $: shouldMove = moving && $movementStore;
  // $nodeSelected is a store boolean that lets GraphView component know if ANY node is selected
  // moving local boolean specific to node selected, to change position of individual node once selected
  let moving = false;
  let moved = false;

  const openEditModal = (e) => {
    e.preventDefault();
    document.querySelector('.edit-node-modal').style.display = 'flex';
  }
  let customCssText;
  const getStyles = (e, node) => {
    const nodeStyles = {};
    const customStyles = {};
    const nodeEl = document.querySelector(`#svelvet-${node.id}`);
    const customEl = document.querySelector('.customClass');

    // console.log('node with custom class', customEl);

    // for (const style in customEl.style) {
    //   if (customEl.style[style] !== '') console.log(style);
    // }

    // console.log(`custom styles for ${node.id}`, customEl.style.cssText);
    // console.log('element', nodeEl);
    
    // // const styles = getComputedStyle(nodeEl);
    const styles = nodeEl.style;
    // console.log(`styles for ${node.id}`, styles.cssText);
    console.log(document.styleSheets);
    const styleRules = document.styleSheets[1].cssRules;
    console.log(styleRules);
    for (const rule in styleRules) {
      console.log(styleRules[rule]);
    }

    console.log(Object.values(styleRules));
    Object.values(styleRules).forEach(rule => {
      if(rule.selectorText === '.customClass') {
        const initialText = rule.cssText;
        console.log('index of bracket', initialText.indexOf('{'));
        const innerText = initialText.substring(15, initialText.length - 2);
        console.log(innerText);
        console.log('custom rule : ', rule.cssText);
        customCssText = innerText;
      }
      // if(rule.selectorText === `.Node.svelte-${key}`) console.log('Node styles: ', rule.cssText);
    })
  }

  afterUpdate((e) => {
    if (node.className) getStyles(e, node);
  })
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
  on:dblclick={(e) => {
    e.preventDefault();
    console.log(node);
    openEditModal(e)
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
  class="Node {node.className || ''}"
  style="left: {node.position.x}px;
    top: {node.position.y}px;
    width: {node.width}px;
    height: {node.height}px;
    background-color: {node.bgColor};
    border-color: {node.borderColor};
    border-radius: {node.borderRadius}px;
    color: {node.textColor};
    {customCssText}"
  id="svelvet-{node.id}"
>

<!-- this anchor is the target-->
  <EdgeAnchor {key} {node} position={node.targetPosition || 'top'} role={'target'} />
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
    <EdgeAnchor {key} {node} position={node.sourcePosition || 'bottom'} role={'source'} />

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
