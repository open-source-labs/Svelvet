<script lang="ts">
  import { v4 as uuidv4 } from 'uuid';
  import type {
    NodeType,
    EdgeType,
    AnchorType,
    StoreType,
    UserNodeType,
    UserEdgeType,
  } from '$lib/store/types/types';
  import { writable, derived, get, readable } from 'svelte/store';
  import {
    createStoreEmpty,
    createStoreFromUserInput,
  } from '$lib/store/controllers/storeApi';
  import { afterUpdate, onMount } from 'svelte';
  import GraphView from './GraphView.svelte';
  import { sanitizeUserNodesAndEdges } from '../controllers/middleware';

  export let nodes: UserNodeType[]; // TODO: update type to make possible user id being a number
  export let edges: UserEdgeType[]; // TODO: update type to make possible user id being a number
  let [userNodes, userEdges] = [nodes, edges]; // rename nodes, edges to make clear that they are of UserNodeType (ie, passed in by the user and not the internal representation of a node/edge)

  export let width: number = 600;
  export let height: number = 600;
  export let background: boolean = true;
  export let movement: boolean = true;
  export let canvasId: string = uuidv4();
  export let snap: boolean = false;
  export let snapTo: number = 30;

  // sanitize user input
  let output = sanitizeUserNodesAndEdges(userNodes, userEdges);
  userNodes = output['userNodes'];
  userEdges = output['userEdges'];

  // generates a unique string for each svelvet component's unique store instance
  // creates a store that uses the unique sting as the key to create and look up the corresponding store
  // this way we can have multiple Svelvet Components on the same page and prevent overlap of information
  const store = createStoreEmpty(canvasId);
  // stores (state) within stores, so that we cannot access values from everywhere
  //   const { widthStore, heightStore, nodesStore, derivedEdges } = svelvetStore;

  // sets the state of the store to the values passed in from the Svelvet Component on initial render
  onMount(() => {
    createStoreFromUserInput(canvasId, userNodes, userEdges);
    store.widthStore.set(width);
    store.heightStore.set(height);
    store.backgroundStore.set(background);
    store.movementStore.set(movement);
    const optionsObj = { snap, snapTo };
    store.options.set(optionsObj);
  });
  // // enables data reactivity. TODO: this needs to be added back in
  // Probably need to use findStore, not create store
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
