<script>
  import { findOrCreateStore } from '../stores/store';
  import { beforeUpdate } from 'svelte';
  export let key;
  export let node;
  export let position;
  export let role;
  export let width;
  export let height;
  let newNode;
  let newEdge;
  let hovered = false;
  let anchorWidth = 10;
  let anchorHeight = 10;
  let top;
  let left;

  const {
      onEdgeMove,
      setAnchorPosition,
      setNewEdgeProps,
      renderEdge,
      renderNewNode,
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

  ////////// ------------ MOVED TO STORE -------------- //////////////////
  // /*
  // This is the function that renders a new edge when an anchor is clicked
  // */  
  // const renderEdge = (e) => {
  //   const [x, y] = setNewEdgeProps(role, position, node)
  //   e.preventDefault(); // preventing default behavior, not sure if necessary
  //   // Setting the newEdge variable to an edge prototype
  //   newEdge = role === 'source' ? { 
  //     id: uuidv4(), // generate unique id
  //     source: node.id, // the source is the node that the anchor is on
  //     target: null, // until the mouse is released the target will be set to null
  //     targetX: x,
  //     targetY: y,
  //     animate: true,
  //   } : { 
  //     id: uuidv4(), // generate unique id
  //     source: null, // until the mouse is released the source will be set to null
  //     target: node.id, // the target is the node that the anchor is on
  //     sourceX: x,
  //     sourceY: y,
  //     animate: true, 
  //   };
  //   store.edgesStore.set([...$derivedEdges, newEdge]); // updating the edges in the store
  // }


  // /*
  // This is the function that renders a new node when the mouse is released
  // after clicking on an anchor, takes in the newEdge that was just created
  // */  
  // const renderNewNode = (event, edge) => {
  //   event.preventDefault();
  //   let pos = position === 'bottom' ? { x: edge.targetX, y: edge.targetY } : { x: edge.sourceX, y: edge.sourceY };
    
  //   // setting newNode variable to a 'prototype' node
  //   newNode = {
  //     id: uuidv4(), 
  //     position: pos, // the position (top left corner) is at the target coords of the edge for now
  //     data: { label: "New Node" }, // need ways to change the rest of the properties
  //     width: 100,
  //     height: 40,
  //     className: 'newNode',
  //     bgColor: "white"
  //   };
  //   if (position === 'left') {
  //     if (role === 'source') {
  //       newNode.sourcePosition = 'left';
  //       newNode.targetPosition = 'right';
  //       edge.target = newNode.id; // set the new edge to target the new node
  //       newNode.position.x = edge.targetX - newNode.width / 2; // moves the node over to the correct position
  //       newNode.position.y = edge.targetY;
  //     }
  //     else {
  //       newNode.sourcePosition = 'right';
  //       newNode.targetPosition = 'left';
  //       edge.source = newNode.id;
  //       newNode.position.x = edge.sourceX - newNode.width / 2;
  //       newNode.position.y = edge.sourceY - newNode.height;
  //     }
  //   } else if (position === 'right') {
  //     if(role === 'source') {
  //       newNode.sourcePosition = 'right';
  //       newNode.targetPosition = 'left';
  //       edge.target = newNode.id; // set the new edge to target the new node
  //       newNode.position.x = edge.targetX - newNode.width / 2; // moves the node over to the correct position
  //       newNode.position.y = edge.targetY;
  //     }
  //     else {
  //       newNode.sourcePosition = 'left';
  //       newNode.targetPosition = 'right';
  //       edge.source = newNode.id;
  //       newNode.position.x = edge.sourceX - newNode.width / 2;
  //       newNode.position.y = edge.sourceY - newNode.height;
  //     }
  //   } else {
  //     if(role === 'source') {
  //       edge.target = newNode.id; // set the new edge to target the new node
  //       newNode.position.x = edge.targetX - newNode.width / 2; // moves the node over to the correct position
  //       newNode.position.y = edge.targetY;
  //     }
  //     else {
  //       edge.source = newNode.id;
  //       newNode.position.x = edge.sourceX - newNode.width / 2;
  //       newNode.position.y = edge.sourceY - newNode.height;
  //     }
  //   }
  //   store.nodesStore.set([...$nodesStore, newNode]); // update the nodes in the store
  // }
  ///////////////////////////////////////////////////////////////////////

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
      } else {
        renderNewNode(e, newEdge, role, position);
      }
    }
    newEdge = null; // reset newEdge so that the next one can be created normally
    moved = false;
    moving = false;
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
    transform: scale(1.6) translateZ(-10px);
  }

</style>