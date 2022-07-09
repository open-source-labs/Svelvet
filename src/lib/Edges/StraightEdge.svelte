<script lang="ts">
  import BaseEdge from '$lib/Edges/BaseEdge.svelte';
  import type { DerivedEdge } from '$lib/types/types';

  export let edge: DerivedEdge;

  $: yOffset = Math.abs(edge.targetY - edge.sourceY) / 2;
  $: centerY = edge.targetY < edge.sourceY ? edge.targetY + yOffset : edge.targetY - yOffset;

  $: xOffset = Math.abs(edge.targetX - edge.sourceX) / 2;
  $: centerX = edge.targetX < edge.sourceX ? edge.targetX + xOffset : edge.targetX - xOffset;
 
  // determine SVG path d (where to be drawn) string value to pass into BaseEdge component
  // path is reactive to current edge source/target X and Y values
  $: path = `M ${edge.sourceX},${edge.sourceY}L ${edge.targetX},${edge.targetY}`;

  $: baseEdgeProps = {
    ...edge,
    path: path,
    centerX: centerX,
    centerY: centerY
  };
</script>

<BaseEdge {baseEdgeProps} />
