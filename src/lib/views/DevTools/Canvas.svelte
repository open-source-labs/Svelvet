<script lang="ts">
  // Declaring variables for Svelvet components which will be usable in other files
  import { Edge, Anchor, Node } from '$lib/models/store';
  import { onMount } from 'svelte';
  import NodeComponent from '$lib/views/DevTools/Node.svelte';
  import AnchorComponent from '$lib/views/DevTools/Anchor.svelte';
  import EdgeComponent from '$lib/views/DevTools/Edge.svelte';
  import {
    createStoreEmpty,
    createStoreFromUserInput,
  } from '$lib/controllers/storeApi';
  import type {
    NodeType,
    EdgeType,
    AnchorType,
    StoreType,
    UserNodeType,
    UserEdgeType,
  } from '$lib/models/types';

  export let nodes: UserNodeType[];
  export let edges: UserEdgeType[];

  const canvasId: string = (Math.random() + 1).toString(36).substring(7);
  const testingStore = createStoreEmpty(canvasId);
  const { nodesStore, edgesStore, anchorsStore } = testingStore;

  onMount(() => {
    const mapLabelToId = createStoreFromUserInput(canvasId, nodes, edges);
  });
</script>

<div>
  {#each Object.keys($nodesStore) as node_id}
    <NodeComponent {node_id} {canvasId} />
  {/each}

  {#each Object.keys($anchorsStore) as anchor_id}
    <AnchorComponent {anchor_id} {canvasId} />
  {/each}
</div>

<svg id="svg">
  {#each Object.keys($edgesStore) as edge_id}
    <EdgeComponent {edge_id} {canvasId} />
  {/each}
</svg>

<style>
  #svg {
    position: absolute;
    z-index: -1000;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
  }
</style>
