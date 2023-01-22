<script lang="ts">
  import type { EdgeType } from '$lib/models/types';
  import SmoothStepEdge from './SmoothStepEdge.svelte';
  export let edge: EdgeType;
</script>

<!-- Utilizes the SmoothStepEdge Component and sets borderRadius to zero to give a sharp edge -->
<SmoothStepEdge {edge} borderRadius={0} />
