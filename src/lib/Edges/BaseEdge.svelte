<script lang="ts">
  import EdgeText from '$lib/Edges/EdgeText.svelte';
  import type { EdgeProps } from '$lib/types/types';

  export let baseEdgeProps: EdgeProps;

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
    centerY
  } = baseEdgeProps);

  // setting edge text props
  $: edgeTextProps = {
    label: label,
    labelBgColor: labelBgColor,
    labelTextColor: labelTextColor,
    centerX: centerX,
    centerY: centerY
  };

  const defaultArrow = `0 0, 9 4.5, 0 9`;
</script>

<defs>
  <marker id="arrow" markerWidth="9" markerHeight="9" refX="8" refY="4" orient="auto">
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
