<script lang="ts">
  import { v4 as uuidv4 } from 'uuid';
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

  import NodesStoreView from './NodesStoreView.svelte';

  // Declaring variables for Svelvet components which will be usable in other files
  export let nodes: UserNodeType[]; // TODO: new type to account for users putting in number in ids
  export let edges: UserEdgeType[]; // TODO: new type to account for users putting in number in ids
  export let width: number = 600;
  export let height: number = 600;
  export let background: boolean = true;
  export let movement: boolean = true;
  export let canvasId: string = uuidv4();

  // sanitize user input
  // This is so that all id's are strings
  nodes = nodes.map((e) => {
    e.id = e.id.toString();
    return e;
  });
  edges = edges.map((e) => {
    e.source = e.source.toString();
    e.target = e.target.toString();
    return e;
  });

  // generates a unique string for each svelvet component's unique store instance
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
  // // enables data reactivity
  // afterUpdate(() => {
  //   svelvetStore.nodesStore.set(nodes);
  //   svelvetStore.edgesStore.set(edges);
  //   svelvetStore.widthStore.set(width);
  //   svelvetStore.heightStore.set(height);
  //   svelvetStore.backgroundStore.set(background);
  //   svelvetStore.movementStore.set(movement);
  // });
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
