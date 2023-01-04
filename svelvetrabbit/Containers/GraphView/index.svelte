<script>
  import { afterUpdate, onMount } from 'svelte';
  import { zoom, zoomTransform, zoomIdentity } from 'd3-zoom';
  import { select, selectAll, pointer, local } from 'd3-selection';
  import SimpleBezierEdge from '../../Edges/SimpleBezierEdge.svelte';
  import StraightEdge from '../../Edges/StraightEdge.svelte';
  import SmoothStepEdge from '../../Edges/SmoothStepEdge.svelte';
  import StepEdge from '../../Edges/StepEdge.svelte';
  import EditModal from '../../Nodes/EditModal.svelte';
  import MinimapBoundless from '../Minimap/MinimapBoundless.svelte';
  import Node from '../../Nodes/index.svelte';
  import { findOrCreateStore } from '../../stores/store';
  import MinimapBoundary from '../Minimap/MinimapBoundary.svelte';
  
  // leveraging d3 library to zoom/pan
  let d3 = {
      zoom,
      zoomTransform,
      zoomIdentity,
      select,
      selectAll,
      pointer
  };
  //these are typscripted as any, however they have been transformed inside of store.ts
  export let nodesStore;
  export let derivedEdges;
  export let key;
  export let initialZoom;
  export let initialLocation;
  export let minimap;
  export let width;
  export let height;
  export let boundary;
  
  // here we lookup the store using the unique key
  const svelvetStore = findOrCreateStore(key);
  // svelvetStore.isLocked.set(true)
  const { nodeSelected, backgroundStore, movementStore, widthStore, heightStore, d3Scale, isLocked, shareable} = svelvetStore;
  // declaring the grid and dot size for d3's transformations and zoom
  const gridSize = 15;
  const dotSize = 10;
  // declare prop to be passed down to the minimap
  let d3Translate = {x: 0, y: 0, k:1};
  //creating function to pass down
  
  // handles case for when minimap sends message back to initiate translation event (click to traverse minimap)
  // moves camera to the clicked node
  function miniMapClick(event) {
    // onclick in case of boundless minimap
    if(!boundary) {
      // For edges
      d3.select(`.Edges-${key}`)
        .transition().duration(500)
        .call(d3Zoom.translateTo, (event.detail.x), (event.detail.y));
      // For nodes
      d3.select(`.Nodes-${key}`)
        .transition().duration(500)
        .call(d3Zoom.translateTo, (event.detail.x), (event.detail.y));
    }
    // handles case for when minimap has a boundary
    else {
      // For edges
      d3.select(`.Edges-${key}`)
        .transition().duration(500)
        .call(d3Zoom.translateTo, (event.detail.x), (event.detail.y));
      // For nodes
      d3.select(`.Nodes-${key}`)
        .transition().duration(500)
        .call(d3Zoom.translateTo, (event.detail.x), (event.detail.y));
    }
  }

  // create d3 instance conditionally based on boundary prop
  function determineD3Instance() {
    if (boundary) {
      return d3
          .zoom()
          .filter(() => !$nodeSelected)
          .scaleExtent([0.4, 2]) // limits for zooming in/out
          .translateExtent([[0, 0], [boundary.x, boundary.y]]) // world extent
          .extent([[0, 0], [width, height]]) 
          .on('zoom', handleZoom);}
    else {
      return d3
        .zoom()
        .filter(() => !$nodeSelected)
        .scaleExtent([0.4, 2])
        .on('zoom', handleZoom);}
  }

  let d3Zoom = determineD3Instance()

  function zoomInit() {
    //set default zoom logic
      d3.select(`.Edges-${key}`)
        //makes sure translation is default at center coordinates
        .transition().duration(0)
        .call(d3Zoom.translateTo, 0, 0)
        //moves camera to coordinates
        .transition().duration(0)
        .call(d3Zoom.translateTo, initialLocation.x, initialLocation.y)
        // zooms in on selected point
        .transition().duration(0)
        .call(d3Zoom.scaleBy, Number.parseFloat(.4 + (.16*initialZoom)).toFixed(2))

      // updates d3Translate with d3 object with x, y, and k values to be sent down to the minimap to be further calculated further
      d3Translate = d3.zoomIdentity.translate(initialLocation.x, initialLocation.y).scale(Number.parseFloat(.4 + (.16*initialZoom)).toFixed(2));

      d3.select(`.Nodes-${key}`)
        .transition().duration(0)
        .call(d3Zoom.translateTo, 0, 0)
        .transition().duration(0)
        .call(d3Zoom.translateTo, initialLocation.x, initialLocation.y)
        .transition().duration(0)
        .call(d3Zoom.scaleBy, Number.parseFloat(.4 + (.16*initialZoom)).toFixed(2))
      
      // sets D3 scale to current k of object
      d3Scale.set(d3.zoomTransform(d3.select(`.Nodes-${key}`)).k)
  }
  
  onMount(() => {
      // actualizes the d3 instance
      d3.select(`.Edges-${key}`).call(d3Zoom);
      d3.select(`.Nodes-${key}`).call(d3Zoom);
      d3.select(`#background-${key}`).call(d3Zoom);
      d3.selectAll('#dot').call(d3Zoom);
      //actualizes the initial zoom and pan
      zoomInit();
  });

  //function that uploads a preexisting node diagram architecture
  const uploadStore = (e) => {
    //selects store-input 
    const storeInput = document.getElementById('store-input');
    //reviver function parses JSON string 
    const reviver = (key, value) => {
      //if node object has key of custom, evaluates and allows for custom components to be uploaded  
      if (key === 'custom') return eval(value);
      return value;
    }
    //grabs input field val
    const text = storeInput.value;
    const newStore = JSON.parse(text, reviver);
    
    //sets nodes/edges from input 
    svelvetStore.nodesStore.set(newStore.nodes);
    svelvetStore.edgesStore.set(newStore.edges);
    //resets input val to empty string
    storeInput.value = '';
  }

  // TODO: Update d3Zoom type (refer to d3Zoom docs)
  
  // function to handle zoom events - arguments: d3ZoomEvent
  function handleZoom(e) {
      if (!$movementStore)
          return;
  //add a store that contains the current value of the d3-zoom's scale to be used in onMouseMove function
  d3Scale.set(e.transform.k);
      // should not run d3.select below if backgroundStore is false
      if ($backgroundStore) {
          d3.select(`#background-${key}`)
              .attr('x', e.transform.x)
              .attr('y', e.transform.y)
              .attr('width', gridSize * e.transform.k)
              .attr('height', gridSize * e.transform.k)
              .selectAll('#dot')
              .attr('x', (gridSize * e.transform.k) / 2 - dotSize / 2)
              .attr('y', (gridSize * e.transform.k) / 2 - dotSize / 2)
              .attr('opacity', Math.min(e.transform.k, 1));
      }
      // transform 'g' SVG elements (edge, edge text, edge anchor)
      d3.select(`.Edges-${key} g`).attr('transform', e.transform);
      // transform div elements (nodes)
      let transform = d3.zoomTransform(this);
      d3Translate = transform;
      
      // selects and transforms all node divs from class 'Node' and performs transformation
      d3.select(`.Node-${key}`)
          .style('transform', 'translate(' + transform.x + 'px,' + transform.y + 'px) scale(' + transform.k + ')')
          .style('transform-origin', '0 0');
  }

  // closes the modal when you click outside of the modal
  const closeEditModal = () => {
    const input = document.querySelector(`.edit-modal-${key}`);
    input.style.display = 'none';
  };

  // Can put afterUpdate functionality into it's own function. 
  const setImportExport = () => {
    function replacer(key, value) {
      // Filtering out properties
      if (key === 'custom') {
        const str = value + '';
        const arr = str.split(' ');
        return arr[1];
      }
      return value;
    }
      // gets the current nodes and edges arrays from the store and saves them in an object
      const state = {nodes: $nodesStore, edges: $derivedEdges};
      // this function creates a data blob and an object URL for it
      const makeTextFile = (text) => {
        const data = new Blob([text], {type: 'application/json'});
        const textFile = window.URL.createObjectURL(data);
        return textFile;
      }
      // Set the download button target to the object URL
      document.getElementById(`downloadState-${key}`).href = makeTextFile(JSON.stringify(state, replacer));
  }
  
  afterUpdate(() => {
    if($shareable) setImportExport();
  })
  </script>
  


<div id="graphview-container" >  
  <!-- This is the container that holds GraphView and we have disabled right click functionality to prevent a sticking behavior -->
  {#if minimap && boundary}
  <MinimapBoundary on:message={miniMapClick} {key} {boundary} {d3Translate}/>
  {:else if minimap }
  <MinimapBoundless on:message={miniMapClick} {key} {d3Translate}/>
  {/if}
  <EditModal {key} />
  <div class={`Nodes Nodes-${key}`} on:contextmenu|preventDefault on:click={closeEditModal} on:keydown={() => {return}}>
    <!-- This container is transformed by d3zoom -->
    <div class={`Node Node-${key}`}>
      {#each $nodesStore as node}
          <!-- If node has html property:  -->
        {#if node.data.html}
          <Node {node} {key} >{@html node.data.html}</Node> <!-- Directly render HTML inside of Node Component  -->
          <!-- If node has 'custom' property: -->
        {:else if node.data.custom}
        <!-- Render custom svelte component -->
          <Node {node} {key} > <svelte:component this={node.data.custom}/> </Node>
        {:else}
          <Node {node} {key} >{node.data.label}</Node>
        {/if}
      {/each}
    </div>
  </div>


  <svg class={`Edges Edges-${key}`} viewBox="0 0 {$widthStore} {$heightStore}" >
    <defs>
      <pattern
        id={`background-${key}`}
        x="0"
        y="0"
        width={gridSize}
        height={gridSize}
        patternUnits="userSpaceOnUse"
      >
        <circle
          id="dot"
          cx={gridSize / 2 - dotSize / 2}
          cy={gridSize / 2 - dotSize / 2}
          r="0.5"
          style="fill: gray"
        />
      </pattern>
    </defs>

    {#if $backgroundStore}
      <rect width="100%" height="100%" style="fill: url(#background-{key});" />
    {/if}

    <!-- <g> tag defines which edge type to render depending on properties of edge object -->
    <g>
      {#each $derivedEdges as edge}
        {#if edge.type === 'straight'}
          <StraightEdge {edge} />
        {:else if edge.type === 'smoothstep'}
          <SmoothStepEdge {edge} />
        {:else if edge.type === 'step'}
          <StepEdge {edge} />
        {:else}
          <SimpleBezierEdge {edge} />
        {/if}
        <!-- sets anchor points type to either arrow or halfcircle-->
        <!-- {#if !edge.noHandle}
          <EdgeAnchor x={edge.sourceX} y={edge.sourceY} {key} />
          {#if !edge.arrow}
            <EdgeAnchor x={edge.targetX} y={edge.targetY} {key} />
          {/if}
        {/if} -->
      {/each}
    </g>
  </svg>

  {#if $shareable}
  <!-- this is for the download button and upload input field -->
  <div id="export-import">
    <a id="downloadState-{key}" download="svelvet-state.json"><svg id="dwnldimg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_iconCarrier"> <path d="M0 0h48v48H0z" fill="none"></path> <g id="Shopicon"> <polygon points="22,4 22,20 14,20 24,30 34,20 26,20 26,4 "></polygon> <path d="M8,44h32c2.206,0,4-1.794,4-4V30h-4v10H8V30H4v10C4,42.206,5.794,44,8,44z"></path> </g> </g></svg></a>
    <input type="text" id="store-input" placeholder="Paste JSON here">
    <button id="store-input-btn" on:click={uploadStore}>Upload</button>
  </div>
  {/if}
</div>
<!-- rendering dots on the background depending on the zoom level -->


<style>
  /* https://www.dropbox.com/s/jesjddg8gldgte2/downloadicon.png?raw=1 */
  

  #graphview-container {
    display: flex;
    align-items: center;
    justify-content: center;

  }
  
  .Nodes {
    position: absolute; 
    width: 100%;
    height: 100%;
    cursor: grab;
    /* pointer-events: none; */
  } 
  
  .Nodes:active {
    cursor: grabbing;
  }
  /* .Node {
    color: black; 
    width: 100%;
    height: 100%;
  } */ 

  #dwnldimg {
    width: 1.5rem;
    margin-right: 0.1rem;
  }

  #store-input, #store-input-btn {
    height: 1.5rem;
    border-radius: .3rem;
    font-size: .7rem;
    margin: 2px;
  }

  #store-input-btn:hover {
    cursor: pointer;
    background-color: #FF4742;
    color: white;
    box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.2);
  }

  #export-import {
    position: absolute;
    left: 10px;
    bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
</style>
