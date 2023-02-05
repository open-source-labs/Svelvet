<script lang="ts">
  import { base } from '$app/paths';
  import { findStore, getEdgeById } from '$lib/store/controllers/storeApi';
  import EdgeText from '../Edges/EdgeText.svelte';
  import type { EdgeProps } from '../Edges/types';
  export let baseEdgeProps: EdgeProps;
  export let canvasId;
  // destructuring the props passed in from the parent component
  $: ({
    path,
    animate,
    arrow,
    label,
    labelBgColor,
    labelTextColor,
    edgeColor,
    centerX,
    centerY,
  } = baseEdgeProps);

  // setting edge text props
  $: edgeTextProps = {
    label: label,
    labelBgColor: labelBgColor,
    labelTextColor: labelTextColor,
    centerX: centerX,
    centerY: centerY,
  };

  // Right now, the delete-edge feature deletes an edge when it is right clicked.
  // In the future, it would be nice to integrate the delete edge feature with a modal
  // that allows for edge properties to be changed. This is why the function name is
  // handleEditModal
  const edgeId = baseEdgeProps.id;
  const handleEditModal = () => {
    const store = findStore(canvasId);
    // const edge = getEdgeById(store, edgeId);
    store.edgeEditModal.set(edgeId);
  };

  const defaultArrow = `0 0, 9 4.5, 0 9`;
</script>

<defs>
  <marker
    id="arrow"
    markerWidth="9"
    markerHeight="9"
    refX="8"
    refY="4"
    orient="auto"
  >
    <polygon points={defaultArrow} fill="gray" />
  </marker>
</defs>

{#if arrow}
  <path
    class={animate ? 'animate' : ''}
    d={path}
    fill="transparent"
    stroke={edgeColor ? edgeColor : 'gray'}
    marker-end="url(#arrow)"
    aria-label="svg-path"
  />
{:else}
  <path
    class={animate ? 'animate' : ''}
    d={path}
    fill="transparent"
    stroke={edgeColor ? edgeColor : 'gray'}
    aria-label="svg-path"
    stroke-width="1"
    on:contextmenu={handleEditModal}
  />
{/if}

{#if edgeTextProps.label}
  <EdgeText {edgeTextProps} />
{/if}

<style>
  .animate {
    stroke-dasharray: 5;
    animation: dash 50000s linear;
  }
  @keyframes dash {
    from {
      stroke-dashoffset: 1000000;
    }
  }
</style>
