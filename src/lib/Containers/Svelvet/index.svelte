<!--Note: Import / export in svelvet is used for passing props  -->
<script lang="ts">
  import GraphView from '$lib/Containers/GraphView/index.svelte';
  import { findOrCreateStore } from '$lib/stores/store';
  import { afterUpdate, onMount } from 'svelte';
  import type { Node, Edge } from '$lib/types/index.js';
  import { addDefaultPositions } from '$lib/Edges/utils';
  // Declaring variables for Svelvet components which will be usable in other files
  export let nodes: Node[];
  export let edges: Edge[];
  export let width: number = 600;
  export let height: number = 600;
  export let background: boolean = false;
  
  //this method assumes !node.position and assigns default positions
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
  afterUpdate(() => {
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
