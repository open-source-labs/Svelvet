<script>
    import { findOrCreateStore } from '../stores/store';
    import { beforeUpdate, afterUpdate } from 'svelte';
    export let key;
    export let node;

    

    let hovered = false;
    let anchorWidth = 13;
    let anchorHeight = 13;
    let top = 0;
    let left = 0;
  
    const {
        deleteNode,
        derivedEdges,
        nodeLinkStore,
        
      } = findOrCreateStore(key);
      // $: shouldMove = moving && $movementStore;
      // $nodeSelected is a store boolean that lets GraphView component know if ANY node is selected
      // moving local boolean specific to node selected, to change position of individual node once selected

    $: store = findOrCreateStore(key);
    
  
    // Before the component is updated, adjust the top and left positions to account for custom class dimensions
    beforeUpdate(() => {
      
    })
  </script>
  


  <!-- renders simple half-circle for the anchor point of the edge -->
  <!-- CHANGED FROM SVG CIRCLE TO DIV -->
 
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
        
      }}
  
      on:mouseup={(e) => {
        e.preventDefault();
        deleteNode(e, node.id)
      }}
  
      on:mouseenter={(e) => {
        hovered = true;
        store.hoveredElement.set(node); // If the mouse enters an anchor, we store the node it's attached to for reference
      }}
      
      on:mouseleave={(e) => {
        store.edgesStore.set($derivedEdges);
        hovered = false;
        store.hoveredElement.set(null); // When the mouse leaves an anchor, we clear the value in the store
      }}
      
      on:keydown={() => {return}}
    >  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 5L5 19" stroke="#333333" stroke-width="2" stroke-linecap="round"></path> <path d="M5 5L19 19" stroke="#333333" stroke-width="2" stroke-linecap="round"></path></svg></div>

  

  
  
  <style>
    .Anchor {
      position: absolute;
      cursor: pointer;
    }

    svg {
      border-radius: .2rem;
      border: black solid 1px;
      background-color: #e45b56;
    }

    .Anchor:hover {
      background-color: #000000;
    }

  </style>