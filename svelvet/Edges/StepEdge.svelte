<script>import SmoothStepEdge from './SmoothStepEdge.svelte';
export let edge;
</script>

<!-- Utilizes the SmoothStepEdge Component and sets borderRadius to zero to give a sharp edge -->
<SmoothStepEdge {edge} borderRadius={0} />
