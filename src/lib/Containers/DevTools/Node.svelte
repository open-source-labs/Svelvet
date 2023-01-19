<script>
import { findStore, createStore } from '$lib/stores/storeSchema'

export let node_id;


const store = findStore();
const {nodesStore, edgesStore, anchorsStore} = store;

console.log('asdsadf',$nodesStore)


</script>

<h2>This is a Node with id {node_id}</h2>



<div
  class="Node"
  style="left: {$nodesStore[node_id].positionX}px;
    top: {$nodesStore[node_id].positionY + 100}px;
    width: {$nodesStore[node_id].width}px;
    height: {$nodesStore[node_id].height}px;
    background-color: {$nodesStore[node_id].bgColor};
    border-color: {$nodesStore[node_id].bgColor};
    border-radius: {5}px;
    color: white;"
  id="svelvet-{node_id}"
>HI IM TEXT</div>

