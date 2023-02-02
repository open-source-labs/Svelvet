
<script>import GraphView from '../GraphView/index.svelte';
import { findOrCreateStore } from '../../stores/store';
import { onMount, afterUpdate } from 'svelte';
// Declaring variables for Svelvet components which will be usable in other files
// declaring default values for props
export let nodes;
export let edges;
export let width = 600;
export let height = 600;
export let background = false;
export let nodeLink = false;
export let nodeCreate = false;
export let nodeEdit = false;
export let movement = true;
export let snap = false;
export let snapTo = 30;
export let bgColor = '#ffffff';
export let initialLocation = {x: 0, y: 0};
export let initialZoom = 4;
export let minimap = false;
export let locked = false;
export let boundary = false;
export let shareable = false;
export let deleteNodes = false;
// generates a unique string for each svelvet component's unique store instance
const key = (Math.random() + 1).toString(36).substring(7);
// creates a store that uses the unique sting as the key to create and look up the corresponding store
// this way we can have multiple Svelvet Components on the same page and prevent overlap of information
const svelvetStore = findOrCreateStore(key);
// stores (state) within stores, so that we cannot access values from everywhere
const { widthStore, heightStore, nodesStore, derivedEdges, backgroundColor, isLocked } = svelvetStore;
// sets the state of the store to the values passed in from the Svelvet Component on initial render
onMount(() => {
    svelvetStore.nodesStore.set(nodes);
    svelvetStore.edgesStore.set(edges);
    svelvetStore.widthStore.set(width);
    svelvetStore.heightStore.set(height);
    svelvetStore.backgroundStore.set(background);
    svelvetStore.movementStore.set(movement);
    svelvetStore.snapgrid.set(snap);
    svelvetStore.backgroundColor.set(bgColor);
    svelvetStore.snapResize.set(snapTo);  
    svelvetStore.initZoom.set(initialZoom);
    svelvetStore.initLocation.set(initialLocation);
    svelvetStore.isLocked.set(locked)
    svelvetStore.boundary.set(boundary)
    svelvetStore.nodeLinkStore.set(nodeLink);
    svelvetStore.nodeCreateStore.set(nodeCreate);
    svelvetStore.nodeEditStore.set(nodeEdit);
    svelvetStore.shareable.set(shareable);
    svelvetStore.deleteNodes.set(deleteNodes);
  });

  afterUpdate(() => {
    svelvetStore.nodesStore.set(nodes);
    svelvetStore.edgesStore.set(edges);
    svelvetStore.widthStore.set(width);
    svelvetStore.heightStore.set(height);
    svelvetStore.backgroundStore.set(background);
    svelvetStore.movementStore.set(movement);
    svelvetStore.snapgrid.set(snap);
    svelvetStore.backgroundColor.set(bgColor);
    svelvetStore.snapResize.set(snapTo);  
    svelvetStore.initZoom.set(initialZoom);
    svelvetStore.initLocation.set(initialLocation);
    svelvetStore.isLocked.set(locked)
    svelvetStore.boundary.set(boundary)
    svelvetStore.nodeLinkStore.set(nodeLink);
    svelvetStore.nodeCreateStore.set(nodeCreate);
    svelvetStore.nodeEditStore.set(nodeEdit);
    svelvetStore.shareable.set(shareable);
    svelvetStore.deleteNodes.set(deleteNodes);
  });

</script>

<!-- Now that a store has been created from the initial nodes and initial edges we drill props from the store down to the D3 GraphView along with the unique key -->
<!-- Pass in props to define svelvet css options -->
<div class="Svelvet" style={`width: ${$widthStore}px; height: ${$heightStore}px; background-color: ${$backgroundColor}`}>
  <GraphView {nodesStore} {boundary} {width} {height} {minimap} {derivedEdges} {key} {initialLocation} {initialZoom}/>
</div>

<style>
  .Svelvet {
    position: relative;
    overflow: hidden;
    display: grid;
    font-family: 'Segoe UI', sans-serif;
  }
</style>
