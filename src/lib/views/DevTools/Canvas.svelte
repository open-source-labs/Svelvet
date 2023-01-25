<script lang="ts">
  // Declaring variables for Svelvet components which will be usable in other files
  import { v4 as uuidv4 } from 'uuid';
  import { Anchor } from '$lib/models/Anchor';
  import { Node } from '$lib/models/Node';
  import { Edge } from '$lib/models/Edge';
  import { onMount } from 'svelte';
  import NodeComponent from '$lib/views/DevTools/Node.svelte';
  import AnchorComponent from '$lib/views/DevTools/Anchor.svelte';
  import EdgeComponent from '$lib/views/DevTools/Edge.svelte';
  import ResizeNodeComponent from '$lib/views/DevTools/ResizeNode.svelte';
  import {
    createStoreEmpty,
    createStoreFromUserInput,
    getNodes,
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

  const canvasId: string = uuidv4();
  const testingStore = createStoreEmpty(canvasId);
  const { nodesStore, edgesStore, anchorsStore, resizeNodesStore } =
    testingStore;

  onMount(() => {
    createStoreFromUserInput(canvasId, nodes, edges);
  });

  $: reactiveNodes = Object.keys($nodesStore);
  $: reactiveAnchors = Object.keys($anchorsStore);
  $: reactiveResize = Object.keys($resizeNodesStore);
</script>

<div>
  {#each reactiveNodes as nodeId}
    <NodeComponent {nodeId} {canvasId} />
  {/each}

  {#each reactiveAnchors as anchor_id}
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
