<script lang="ts">
  import GraphView from '$lib/Containers/GraphView/index.svelte';
  import { findOrCreateStore } from '$lib/stores/store';
  import { onMount } from 'svelte';
  import type { Node, Edge } from '$lib/types/index.js';

  export let nodes: Node[];
  export let edges: Edge[];
  export let width: number = 600;
  export let height: number = 600;
  export let background: boolean = false;

  const key = (Math.random() + 1).toString(36).substring(7);
  const svelvetStore = findOrCreateStore(key);

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
