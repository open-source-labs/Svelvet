<script lang="ts">
  import type {
    NodeType,
    EdgeType,
    AnchorType,
    StoreType,
    UserNodeType,
    UserEdgeType,
  } from '$lib/models/types';
  //   import GraphView from '$lib/views/Containers/GraphView/index.svelte';
  import {
    createStoreEmpty,
    createStoreFromUserInput,
  } from '$lib/controllers/storeApi';
  import { afterUpdate, onMount } from 'svelte';
  import GraphView from './GraphView.svelte';

  // Declaring variables for Svelvet components which will be usable in other files
  export let nodes: UserNodeType[];
  export let edges: UserEdgeType[];
  export let width: number = 600;
  export let height: number = 600;
  export let background: boolean = false;
  export let movement: boolean = true;

  // generates a unique string for each svelvet component's unique store instance
  const canvasId: string = (Math.random() + 1).toString(36).substring(7);
  // creates a store that uses the unique sting as the key to create and look up the corresponding store
  // this way we can have multiple Svelvet Components on the same page and prevent overlap of information
  const svelvetStore = createStoreEmpty(canvasId);
  // stores (state) within stores, so that we cannot access values from everywhere
  //   const { widthStore, heightStore, nodesStore, derivedEdges } = svelvetStore;

  // sets the state of the store to the values passed in from the Svelvet Component on initial render
  onMount(() => {
    createStoreFromUserInput(canvasId, nodes, edges);
    svelvetStore.widthStore.set(width);
    svelvetStore.heightStore.set(height);
    svelvetStore.backgroundStore.set(background);
    svelvetStore.movementStore.set(movement);
  });
  // enables data reactivity
  //   afterUpdate(() => {
  //     svelvetStore.nodesStore.set(nodes);
  //     svelvetStore.edgesStore.set(edges);
  //     svelvetStore.widthStore.set(width);
  //     svelvetStore.heightStore.set(height);
  //     svelvetStore.backgroundStore.set(background);
  //     svelvetStore.movementStore.set(movement);
  //   });
</script>

<!-- Now that a store has been created from the initial nodes and initial edges we drill props from the store down to the D3 GraphView along with the unique key -->
<div class="Svelvet" style={`width: ${width}px; height: ${height}px`}>
  <GraphView {canvasId} />
</div>

<style>
  .Svelvet {
    position: relative;
    overflow: hidden;
    display: grid;
    font-family: 'Segoe UI', sans-serif;
  }
</style>
