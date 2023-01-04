<script>
  import { findOrCreateStore } from '../stores/store';
  import { beforeUpdate } from 'svelte';
  export let key;
  export let node;
  export let position;
  export let role;
  export let width;
  export let height;
  
  let newEdge;
  let hovered = false;
  let anchorWidth = 13;
  let anchorHeight = 13;
  let top;
  let left;

  const {
      onEdgeMove,
      setAnchorPosition,
      renderEdge,
      renderNewNode,
      hoveredElement,
      derivedEdges,
      nodeLinkStore,
      nodeCreateStore
    } = findOrCreateStore(key);
    // $: shouldMove = moving && $movementStore;
    // $nodeSelected is a store boolean that lets GraphView component know if ANY node is selected
    // moving local boolean specific to node selected, to change position of individual node once selected
    let moving = false;
    let moved = false;
    let edgeShouldMove = false;
  $: store = findOrCreateStore(key);

  // Before the component is updated, adjust the top and left positions to account for custom class dimensions
  beforeUpdate(() => {
    top = setAnchorPosition(position, width, height, anchorWidth, anchorHeight)[0];
    left = setAnchorPosition(position, width, height, anchorWidth, anchorHeight)[1];
  })
</script>

<svelte:window
  on:mousemove={(e) => {
    e.preventDefault();
    if (newEdge && edgeShouldMove) {
      onEdgeMove(e, newEdge.id); // re-renders (moves) the edge while the mouse is down and moving
      moved = true;
    }
  }}

  on:mouseup={(e) => {
    edgeShouldMove = false; // prevent the new edge from moving
    if (newEdge && moved) {
      newEdge.animate = false;
      if($hoveredElement) {
        if (role === 'target') newEdge.source = $hoveredElement.id;
        else newEdge.target = $hoveredElement.id;
        store.edgesStore.set([...$derivedEdges, newEdge]);
      } else if ($nodeCreateStore) {
        renderNewNode(e, node, newEdge, role, position);
      } else {
        //if no anchor is found (no place to connect new edge), update edges store filtering out newly constructed edge
        store.edgesStore.set($derivedEdges.filter(e => e.id !== newEdge.id));
      }
    }
    newEdge = null; // reset newEdge so that the next one can be created normally
    moved = false;
    moving = false;
  }}

/>

<!-- renders simple half-circle for the anchor point of the edge -->
<!-- CHANGED FROM SVG CIRCLE TO DIV -->
{#if $nodeLinkStore} 
<!-- if interactivity is enabled, set event listeners on anchors and hover effects -->
  <div
    class="Anchor" 
    style={`
      height:${anchorHeight}px;
      width:${anchorWidth}px;
      top: ${top}px;
      left:${left}px;
    `}
    
    on:mousedown={(e) => {
      e.preventDefault();
      e.stopPropagation(); // Important! Prevents the event from firing on the parent element (the .Nodes div) 
      edgeShouldMove = true;
    }}

    on:mouseup={(e) => {
      e.preventDefault();
      edgeShouldMove = false;
      moving = false;
      moved = false;
    }}

    on:mouseenter={(e) => {
      hovered = true;
      store.hoveredElement.set(node); // If the mouse enters an anchor, we store the node it's attached to for reference
    }}
    
    on:mouseleave={(e) => {
      if (edgeShouldMove) newEdge = renderEdge(e, node, role, position); // renders the new edge on the screen
      hovered = false;
      store.hoveredElement.set(null); // When the mouse leaves an anchor, we clear the value in the store
    }}
    
    on:keydown={() => {return}}
  ></div>
{:else}
<div
  class="Anchor-inert" 
  style={`
    height:${anchorHeight}px;
    width:${anchorWidth}px;
    top: ${top}px;
    left:${left}px;
  `}
></div>

{/if}


<style>
  .Anchor, .Anchor-inert {
    position: absolute;
    border-radius: 50%;
    cursor: crosshair;
    background-color: rgb(105, 99, 99);
    transform: translateZ(-10px);
  }

  .Anchor:hover {
    transform: scale(1.8) translateZ(-10px);
    background-color: #FF4742;
    box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.2);
  }

  .Anchor-inert {
    cursor: move;
  }
</style>