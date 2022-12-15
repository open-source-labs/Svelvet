<script>
  import { select, selectAll, pointer } from 'd3-selection';
  import { v4 as uuidv4 } from 'uuid';
  import { Position } from '../types/utils';
  import { findOrCreateStore } from '../stores/store';
  import { derived } from 'svelte/store';
  export let key;
  export let node;
  export let position;
  export let role;
  let newNode;
  let newEdge;
  let hovered = false;
  let anchorWidth = 10;
  let anchorHeight = 10;
  // let top;
  // let left;

  const {
      onEdgeMove,
      onTouchMove,
      setAnchorPosition,
      setNewEdgeProps,
      edgeSelected,
      edgeIdSelected,
      movementStore,
      mouseX,
      mouseY,
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
  const [top, left] = setAnchorPosition(position, node, anchorWidth, anchorHeight);
  // const [x, y] = setNewEdgeProps(role, position, node)


  // let d3 = {
  //     select,
  //     pointer
  // };
  /* This keeps track of the cursors current position, taking into account d3 transformations,
  updating the mouseX and mouseY values in the store
  */
  // d3.select('.Nodes') 
  //   .on('mousemove', (event) => {
  //     store.mouseX.set(d3.pointer(event)[0]);
  //     store.mouseY.set(d3.pointer(event)[1]);
  //   })


  /*
  This is the function that renders a new edge when an anchor is clicked
  */  
  const renderEdge = (e) => {
    const [x, y] = setNewEdgeProps(role, position, node)
    e.preventDefault(); // preventing default behavior, not sure if necessary
      // console.log('correct x and y', node.position.x + (node.width / 2), node.position.y + node.height)
      // console.log('mouse x and y', $mouseX, $mouseY);
    console.log('role', role);
    // Setting the newEdge variable to an edge prototype
    newEdge = role === 'source' ? { 
      id: uuidv4(), // need better way to generate id, uuid?
      source: node.id, // the source is the node that the anchor is on
      target: null, // until the mouse is released the target will be set to null
      targetX: x,
      targetY: y,
      animate: true,
      label: "newEdge" 
    } : { 
      id: uuidv4(), // need better way to generate id, uuid?
      source: null, // until the mouse is released the source will be set to null
      target: node.id, // the target is the node that the anchor is on
      sourceX: x,
      sourceY: y,
      animate: true,
      label: "newEdge" 
    };
    console.log('role', role, 'x, y', x, y);
    store.edgesStore.set([...$derivedEdges, newEdge]); // updating the edges in the store
  }

  /*
  This is the function that renders a new node when the mouse is released
  after clicking on an anchor, takes in the newEdge that was just created
  */  
  const renderNewNode = (event, edge) => {
    event.preventDefault();
    const [x, y] = setNewEdgeProps(role, position, node)
    let pos = position === 'bottom' ? { x: edge.targetX, y: edge.targetY } : { x: edge.sourceX, y: edge.sourceY };
    
    // setting newNode variable to a 'prototype' node
    newNode = {
      id: uuidv4(), // again, better id generation needed, uuid?
      position: pos, // the position (top left corner) is at the target coords of the edge for now
      data: { label: "newNode" }, // need ways to change the rest of the properties
      width: 100,
      height: 40,
      bgColor: "white"
    };
    if (position === 'left') {
      if (role === 'source') {
        console.log('sourceeeeeee');
        newNode.sourcePosition = 'left';
        newNode.targetPosition = 'right';
        edge.target = newNode.id; // set the new edge to target the new node
        newNode.position.x = edge.targetX - newNode.width / 2; // moves the node over to the correct position
        newNode.position.y = edge.targetY;
      }
      else {
        newNode.sourcePosition = 'right';
        newNode.targetPosition = 'left';
        edge.source = newNode.id;
        newNode.position.x = edge.sourceX - newNode.width / 2;
        newNode.position.y = edge.sourceY - newNode.height;
      }
    } else if (position === 'right') {
      if(role === 'source') {
        newNode.sourcePosition = 'right';
        newNode.targetPosition = 'left';
        edge.target = newNode.id; // set the new edge to target the new node
        newNode.position.x = edge.targetX - newNode.width / 2; // moves the node over to the correct position
        newNode.position.y = edge.targetY;
      }
      else {
        newNode.sourcePosition = 'left';
        newNode.targetPosition = 'right';
        edge.source = newNode.id;
        newNode.position.x = edge.sourceX - newNode.width / 2;
        newNode.position.y = edge.sourceY - newNode.height;
      }
    } else {
      if(role === 'source') {
        edge.target = newNode.id; // set the new edge to target the new node
        newNode.position.x = edge.targetX - newNode.width / 2; // moves the node over to the correct position
        newNode.position.y = edge.targetY;
      }
      else {
        edge.source = newNode.id;
        newNode.position.x = edge.sourceX - newNode.width / 2;
        newNode.position.y = edge.sourceY - newNode.height;
      }
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
    newEdge.animate = false;
    edgeShouldMove = false; // prevent the new edge from moving
    moving = false;
    moved = false;
    if (newEdge) {
      if($hoveredElement) {
        if (role === 'target') newEdge.source = $hoveredElement.id;
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
<!-- CHANGED FROM SVG CIRCLE TO DIV -->
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