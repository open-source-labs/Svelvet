<!--Note: Import / export in svelvet is used for passing props  -->
<script lang="ts">
  import GraphView from '$lib/Containers/GraphView/index.svelte';
  import { findOrCreateStore } from '$lib/stores/store';
  import { onMount } from 'svelte';
  import type { Node, Edge } from '$lib/types/index.js';
  // Declaring variables for Svelvet components which will be usable in other files
  export let nodes: Node[];
  export let edges: Edge[];
  export let width: number = 600;
  export let height: number = 600;
  export let background: boolean = false;

  // ASK TEAM IF I SHOULD REMOVE POSTION PROPERTY, 
  const addDefaultPositions = (nodeArray: Node[]) :void => {
    //this method assumes no position property
    //create a counter that increments to add values to the unassigned node positions
    let newPostionsObject = {
      x: 50,
      y: 50
    };
    //iterate through the nodes Array and check if any node where !node.position
    nodes.forEach((element: Node) => {
      //if !node.position
      if(!element.position){
      // assign an {x: , y:}
        const {x, y} = newPostionsObject;
        element.position = {x: x, y: y};
      }
      //increment the assignments so they don't spawn on top of one another
      newPostionsObject.x += 60;
      newPostionsObject.y += 60;
    });

    /*This one assumes a position property but the x, y are undefined
      //create a counter that incremnents to add values to the unassigned node positions
    let newPostionsObject = {
      x: 50,
      y: 50
    };

    nodes.forEach((element: Node) => {
      //console.log('Node id-->', element.id, 'node.postion.x-->', element.position.x, 'node.position.y-->', element.position.x)

      if(!element.position.x && !element.position.y){
        //console.log('ran addDefault')
        //console.log('Node id-->', element.id, 'node.postion.x-->', element.position.x, 'node.position.y-->', element.position.x)
        element.position.x = newPostionsObject.x;
        element.position.y = newPostionsObject.y;
      }
      //increment the assignments so they don't spawn on top of one another
      newPostionsObject.x += 60;
      newPostionsObject.y += 60;
    });
    */
  }
  addDefaultPositions(nodes);
  //Ask Team: What was purpose of using Math.random here? What if we need to lookup the store and cannot access the randomly generated key?
  // - ANSWER :
  const key = (Math.random() + 1).toString(36).substring(7);
  const svelvetStore = findOrCreateStore(key);
  // stores (state) within stores, so that we cannot access values from everywhere
  const { widthStore, heightStore, nodesStore, derivedEdges } = svelvetStore;

  onMount(() => {
    svelvetStore.nodesStore.set(nodes);
    svelvetStore.edgesStore.set(edges);
    svelvetStore.widthStore.set(width);
    svelvetStore.heightStore.set(height);
    svelvetStore.backgroundStore.set(background);
  });
</script>

<div class="Svelvet" style={`width: ${$widthStore}px; height: ${$heightStore}px`}>
  <GraphView {nodesStore} {derivedEdges} {key} />
</div>

<style>
  .Svelvet {
    position: relative;
    overflow: hidden;
    display: grid;
    font-family: 'Segoe UI', sans-serif;
    background-color: white;
  }
</style>
