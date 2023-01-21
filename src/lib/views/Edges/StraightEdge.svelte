<!-- Handling the rendering of edges -->
<script lang="ts">
  import BaseEdge from '$lib/views/Edges/BaseEdge.svelte';
  import type { DerivedEdge } from '$lib/types/types';

  export let edge: DerivedEdge;

  // offset is determining the difference between X and Y coordinates of the source and target nodes
  $: xOffset = Math.abs(edge.targetX - edge.sourceX) / 2;
  $: yOffset = Math.abs(edge.targetY - edge.sourceY) / 2;
  // determining the center point of the edge to be used in the EdgeText component
  $: centerX =
    edge.targetX < edge.sourceX
      ? edge.targetX + xOffset
      : edge.targetX - xOffset;
  $: centerY =
    edge.targetY < edge.sourceY
      ? edge.targetY + yOffset
      : edge.targetY - yOffset;

  // determine SVG path d (where to be drawn) string value to pass into BaseEdge component
  // path is reactive to current edge source/target X and Y values
  $: path = `M ${edge.sourceX},${edge.sourceY}L ${edge.targetX},${edge.targetY}`;

  $: baseEdgeProps = {
    ...edge,
    path: path,
    centerX: centerX,
    centerY: centerY,
  };
</script>

<BaseEdge {baseEdgeProps} />
