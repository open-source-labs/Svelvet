<script lang="ts">
  import SmoothStepEdge from './SmoothStepEdge.svelte';
  import type { DerivedEdge } from '$lib/types';
  export let edge: DerivedEdge;
</script>

<!-- Utilizes the SmoothStepEdge Component and sets borderRadius to zero to give a sharp edge -->
<SmoothStepEdge {edge} borderRadius={0} />
