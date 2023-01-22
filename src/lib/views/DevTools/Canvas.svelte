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
    TypeUserNode,
    TypeUserEdge,
  } from '$lib/models/types';

  export let nodes: TypeUserNode[];
  export let edges: TypeUserEdge[];

  const canvasId: string = (Math.random() + 1).toString(36).substring(7);
  const testingStore = createStoreEmpty(canvasId);
  const { nodesStore, edgesStore, anchorsStore } = testingStore;

  onMount(() => {
    const mapLabelToId = createStoreFromUserInput(canvasId, nodes, edges);

    const arrEdges = edges.map((edge) => {
      return edge;
    });

    // const objEdges = {};
    // arrEdges.forEach((parsedEdge: object, idx: number) => {
    //   // 		{ id: 'e1-2', source: 1, type: 'straight', target: 2, label: 'e1-2' },
    //   const { source, target, type } = parsedEdge;
    //   const arr4 = arr2[idx];
    //   const sourceAnchor = arr4[0];
    //   const targetAnchor = arr4[1];
    //   // create edge
    //   const edge_id = (Math.random() + 1).toString(36).substring(7);
    //   objEdges[edge_id] = new Edge(
    //     edge_id,
    //     source,
    //     target,
    //     type,
    //     sourceAnchor.positionX,
    //     sourceAnchor.positionY,
    //     targetAnchor.positionX,
    //     targetAnchor.positionY,
    //     sourceAnchor.id,
    //     targetAnchor.id,
    //     canvasId
    //   );
    // });
    // testingStore.edgesStore.set(objEdges);
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
