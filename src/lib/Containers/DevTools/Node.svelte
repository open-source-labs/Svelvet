<script>
import { findStore, createStore } from '$lib/stores/storeSchema'

export let node_id;


const store = findStore();
const {nodesStore, edgesStore, anchorsStore} = store;

let isSelected = false;

let asdf
$: asdf = $nodesStore[node_id];
</script>

<svelte:window
  on:mousemove={(e) => {
      e.preventDefault();
      //console.log('we wanna see what is inside the e: ', e)
      if (isSelected) {
        //   console.log('this is horizontal mouse movement: ',e.movementX);
        //   console.log('this is vertical mouse movement', e.movementY)
        //   $nodesStore[node_id].setPosition(e.movementX, e.movementY)
        nodesStore.update((nodes) => {
            const node = nodes[node_id];
            node.setPosition(e.movementX, e.movementY);
            return {...nodes}
        })
        //   nodesStore.update((nodesObj) => {
        //     nodesObj[node_id].setPosition(e.movementX, e.movementY)
        //   })
      }
  }}

  on:mouseup={(e) => {
      e.preventDefault();
      isSelected = false;
  }}
/>

<!-- // This is the function handler for the mouseMove event to update the position of the selected node.
const onMouseMove = (e: any, nodeID: number) => {
  coreSvelvetStore.nodesStore.update((n) => {
    n.forEach((node: Node) => {
      if (node.id === nodeID) {
        //retrieve d3Scale value from store
        const scale = get(coreSvelvetStore.d3Scale);
        // divide the movement value by scale to keep it proportional to d3Zoom transformations
        node.position.x += e.movementX / scale;
        node.position.y += e.movementY / scale;
      }
    });
    return [...n];
  });
}; -->

{JSON.stringify(asdf)}
<div
  on:mousedown={(e) => {
      e.preventDefault();
      isSelected = true;
  }}



  class="Node"
  style="left: {asdf.positionX}px;
    top: {asdf.positionY + 100}px;
    width: {asdf.width}px;
    height: {asdf.height}px;
    background-color: {asdf.bgColor};
    border-color: {asdf.bgColor};
    border-radius: {5}px;
    color: white;"
  id="svelvet-{node_id}"
>HI IM TEXT</div>

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
  }
</style>