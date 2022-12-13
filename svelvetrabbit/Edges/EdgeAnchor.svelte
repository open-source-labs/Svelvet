<script>
  import { select, selectAll } from 'd3-selection';
  import { Position } from '../types/utils';
  import { findOrCreateStore } from '../stores/store';
  import { derived } from 'svelte/store';
  export let key;
  export let node;
  export let position;
  let newNode;
  let newEdge;
  let hovered = false;
  let anchorWidth = 10;
  let anchorHeight = 10;

  const {
      onEdgeMove,
      onTouchMove,
      edgeSelected,
      edgeIdSelected,
      movementStore,
      hoveredElement,
      derivedEdges,
      nodesStore
    } = findOrCreateStore(key);
    // $: shouldMove = moving && $movementStore;
    // $nodeSelected is a store boolean that lets GraphView component know if ANY node is selected
    // moving local boolean specific to node selected, to change position of individual node once selected
    let moving = false;
    let moved = false;
    let edgeShouldMove = false;
  $: store = findOrCreateStore(key);

  /* This keeps track of the cursors current position, taking into account d3 transformations,
  updating the mouseX and mouseY values in the store
  */
  // d3.select('svg') 
  //   .on('mousemove', (event) => {
  //     store.mouseX.set(d3.pointer(event)[0]);
  //     store.mouseY.set(d3.pointer(event)[1]);
  //   })

  /*
  This is the function that renders a new edge when an anchor is clicked
  */  
  const renderEdge = (e) => {
    e.preventDefault(); // preventing default behavior, not sure if necessary
 
    // set the target or the source depending on the anchor position
    // let source = position === 'bottom' ? node.id : null;
    // let target = position === 'top' ? node.id : null;
    // Setting the newEdge variable to an edge prototype
    newEdge = position === 'bottom' ? { 
      id: (Math.random() + 10).toFixed(2), // need better way to generate id, uuid?
      source: node.id, // the source is the node that the anchor is on
      target: null, // until the mouse is released the target will be set to null
      targetX: node.position.x + (node.width / 2),
      targetY: node.position.y + node.height,
      label: "newEdge" 
    } : { 
      id: (Math.random() + 10).toFixed(2), // need better way to generate id, uuid?
      source: null, // until the mouse is released the source will be set to null
      target: node.id, // the target is the node that the anchor is on
      sourceX: node.position.x + (node.width / 2),
      sourceY: node.position.y,
      label: "newEdge" 
    };
    console.log($derivedEdges);
    store.edgesStore.set([...$derivedEdges, newEdge]); // updating the edges in the store
  }

  /*
  This is the function that renders a new node when the mouse is released
  after clicking on an anchor, takes in the newEdge that was just created
  */  
  const renderNewNode = (event, edge) => {
    event.preventDefault();
    let pos = position === 'bottom' ? { x: edge.targetX, y: edge.targetY } : { x: edge.sourceX, y: edge.sourceY };
    // setting newNode variable to a 'prototype' node
    newNode = {
      id: (Math.random() + 10).toFixed(2), // again, better id generation needed, uuid?
      position: pos, // the position (top left corner) is at the target coords of the edge for now
      data: { label: "newNode" }, // need ways to change the rest of the properties
      width: 100,
      height: 40,
      bgColor: "white"
    };

    if(position === 'bottom') {
      edge.target = newNode.id; // set the new edge to target the new node
      newNode.position.x = edge.targetX - newNode.width / 2; // moves the node over to the correct position
    }
    else {
      edge.source = newNode.id;
      newNode.position.x = edge.sourceX - newNode.width / 2;
      newNode.position.y = edge.sourceY - newNode.height;
    }

    store.nodesStore.set([...$nodesStore, newNode]); // update the nodes in the store
  }
</script>

<svelte:window
  on:mousemove={(e) => {
    e.preventDefault();
    if (edgeShouldMove) {
      onEdgeMove(e, newEdge.id); // re-renders (moves) the edge while the mouse is down and moving
      moved = true;
    }
  }}

  on:mouseup={(e) => {
    edgeShouldMove = false; // prevent the new edge from moving
    moving = false;
    moved = false;
    if (newEdge) {
      if($hoveredElement) {
        if (position === 'top') newEdge.source = $hoveredElement.id;
        else newEdge.target = $hoveredElement.id;
        store.edgesStore.set([...$derivedEdges, newEdge]);
      } else {
        renderNewNode(e, newEdge);
      }
    }
    newEdge = null; // reset newEdge so that the next one can be created normally
  }}
/>

<!-- renders simple half-circle for the anchor point of the edge -->
<div
  class="Anchor" 
  style={`
    top: ${position === 'top' ? - anchorHeight / 2 : node.height - anchorHeight / 2}px;
    left:${node.width / 2 - anchorWidth / 2}px;
  `}

  on:mousedown={(e) => {
    e.preventDefault();
    e.stopPropagation(); // Important! Prevents the event from firing on the parent element (the .Nodes div) 
    renderEdge(e); // renders the new edge on the screen
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
    hovered = false;
    store.hoveredElement.set(null); // When the mouse leaves an anchor, we clear the value in the store
  }}

></div>


<style>
  .Anchor {
    position: absolute;
    top: -5px;
    left: 50px;

    width: 12px;
    height: 10px;
    border-radius: 40%;
    cursor: crosshair;
    background-color: rgb(105, 99, 99);
    z-index: -1 !important; 
    transform: translateZ(-10px);
    /* pointer-events: all; */ 
  }

  .Anchor:hover {
    transform: scale(1.5) translateZ(-10px);
  }
  /* circle {
    position: absolute;
    background-color: white;
  } */
</style>