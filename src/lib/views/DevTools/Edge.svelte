<script lang="ts">
  import { findStore } from '$lib/controllers/storeApi';

  export let edge_id: string;

  const store = findStore();
  const { nodesStore, edgesStore, anchorsStore } = store;

  let reactEdge: object;
  $: reactEdge = $edgesStore[edge_id];
  console.log('reactEdge', JSON.stringify(reactEdge));
</script>

<!-- <path d="M10 10 C 40 10, 65 10, 95 80 S 150 150, 180 80" stroke="black"/> -->
<!-- creates line -->
<path
  d={`M ${reactEdge.sourceX.toString()} ${reactEdge.sourceY.toString()} L ${reactEdge.targetX.toString()} ${reactEdge.targetY.toString()}`}
  stroke="black"
/>

<!-- Points -->
<circle cx="10" cy="10" r="2" fill="red" />
