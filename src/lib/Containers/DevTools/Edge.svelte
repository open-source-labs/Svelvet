<script lang='ts'>
    import { findStore, createStore } from '$lib/stores/storeSchema'
    
    export let edge_id : string;
    
    
    const store = findStore();
    const {nodesStore, edgesStore, anchorsStore} = store;

    let reactEdge
    $: reactEdge = $edgesStore[edge_id]
</script>

<p>this is an edge: {JSON.stringify(reactEdge)}</p>
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">

    <path d="M10 10 C 40 10, 65 10, 95 80 S 150 150, 180 80" stroke="black"/>
  
    <!-- Points -->
    <circle cx="10" cy="10" r="2" fill="red"/>
  
  </svg>
  

