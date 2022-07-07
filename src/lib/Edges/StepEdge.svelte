<script lang='ts'>
  import SmoothStepEdge from './SmoothStepEdge.svelte';
  import type { DerivedEdge } from '$lib/types'
  export let edge: DerivedEdge;
</script>

<SmoothStepEdge {edge} borderRadius={0} />