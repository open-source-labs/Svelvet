<!-- Handling the rendering of edges -->
<script lang="ts">
  import { findStore } from '../../../store/controllers/storeApi';
  import BaseEdge from './BaseEdge.svelte';

  export let edgeId: string;
  export let canvasId: string;
  const store = findStore(canvasId);
  const { nodesStore, edgesStore, anchorsStore } = store;

  $: edge = $edgesStore[edgeId];

  // determine SVG path d (where to be drawn) string value to pass into BaseEdge component
  // path is reactive to current edge source/target X and Y values
  $: path = `M ${edge.sourceX},${edge.sourceY}L ${edge.targetX},${edge.targetY}`;

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

  $: baseEdgeProps = {
    ...edge,
    path: path,
    centerX: centerX,
    centerY: centerY,
  };
</script>

<BaseEdge {baseEdgeProps} {canvasId} />
