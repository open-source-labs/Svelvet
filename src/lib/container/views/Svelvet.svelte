<script lang="ts">
  import { v4 as uuidv4 } from 'uuid';
  import type {
    NodeType,
    EdgeType,
    StoreType,
    UserNodeType,
    UserEdgeType,
  } from '$lib/store/types/types';
  import { writable, derived, get, readable } from 'svelte/store';
  import {
    createStoreEmpty,
    populateSvelvetStoreFromUserInput,
  } from '$lib/store/controllers/storeApi';
  import { afterUpdate, onMount } from 'svelte';
  import GraphView from './GraphView.svelte';
  import { sanitizeUserNodesAndEdges } from '../controllers/middleware';

  import ImportExport from '$lib/importingExporting/views/ImportExport.svelte';

  export let nodes: UserNodeType[]; // TODO: update type to make possible user id being a number
  export let edges: UserEdgeType[]; // TODO: update type to make possible user id being a number
  export let bgColor = '#ffffff'; // this is used to set the background color of the the Svelvet canvas

  export let width: number = 600;
  export let height: number = 600;
  export let background: boolean = true;
  export let movement: boolean = true;
  export let canvasId: string = uuidv4();
  export let snap: boolean = false;
  export let snapTo: number = 30;
  export let nodeCreate: boolean = false;

  //default value of shareable will be set to false
  export let shareable: boolean = false;

  // generates a unique string for each svelvet component's unique store instance
  // creates a store that uses the unique sting as the key to create and look up the corresponding store
  // this way we can have multiple Svelvet Components on the same page and prevent overlap of information
  const store = createStoreEmpty(canvasId);
  // stores (state) within stores, so that we cannot access values from everywhere
  //   const { widthStore, heightStore, nodesStore, derivedEdges } = svelvetStore;

  // sets the state of the store to the values passed in from the Svelvet Component on initial render
  onMount(() => {
    // sanitize user input
    let output = sanitizeUserNodesAndEdges(nodes, edges);
    const userNodes = output['userNodes'];
    const userEdges = output['userEdges'];

    // set canvas related stores. you need to do this before setting node/edge related stores because
    // initializing nodes/edges might read relevant options from the store.
    store.widthStore.set(width);
    store.heightStore.set(height);
    store.backgroundStore.set(background);
    store.movementStore.set(movement);
    const optionsObj = { snap, snapTo }; // TODO: rename to snap
    store.options.set(optionsObj); //
    store.nodeCreate.set(nodeCreate);

    // set node/edge related stores
    populateSvelvetStoreFromUserInput(canvasId, userNodes, userEdges);
  });
  // // enables data reactivity. TODO: this needs to be added back in
  // Probably need to use findStore, not create store
  afterUpdate(() => {
    // sanitize user input
    let output = sanitizeUserNodesAndEdges(nodes, edges);
    const userNodes = output['userNodes'];
    const userEdges = output['userEdges'];

    // console.log('afterUpdated callback fired')
    // console.log(nodes)

    // console.log('should be sanitized nodes and edges? => ', userNodes, userEdges)

    // set canvas related stores. you need to do this before setting node/edge related stores because
    // initializing nodes/edges might read relevant options from the store.
    store.widthStore.set(width);
    store.heightStore.set(height);
    store.backgroundStore.set(background);
    store.movementStore.set(movement);
    const optionsObj = { snap, snapTo }; // TODO: rename to snap
    store.options.set(optionsObj); //
    store.nodeCreate.set(nodeCreate);

    // set node/edge related stores
    populateSvelvetStoreFromUserInput(canvasId, userNodes, userEdges);
  });
</script>

<!-- Now that a store has been created from the initial nodes and initial edges we drill props from the store down to the D3 GraphView along with the unique key -->
<div
  class="Svelvet"
  style={`width: ${width}px; height: ${height}px; background-color: ${bgColor};`}
>
  <GraphView {canvasId} />
  {#if shareable}
    <ImportExport id={canvasId} />
  {/if}
</div>

<style>
  .Svelvet {
    position: relative;
    overflow: hidden;
    display: grid;
    font-family: 'Segoe UI', sans-serif;
  }
</style>
