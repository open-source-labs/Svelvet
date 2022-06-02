<script>
  import BaseEdge from '$lib/Edges/BaseEdge.svelte';

  export let edge;

  // determine SVG path d (where to be drawn) string value to pass into BaseEdge component
  // path is reactive to current edge source/target X and Y values
  $: path = `M ${edge.sourceX},${edge.sourceY}L ${edge.targetX},${edge.targetY}`;

  $: baseEdgeProps = {
    ...edge,
    path: path
  };
</script>

<BaseEdge {baseEdgeProps} />
