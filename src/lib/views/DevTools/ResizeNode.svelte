<script lang="ts">
  import { findStore } from '$lib/controllers/storeApi';
  import type { ResizeNodeType } from '$lib/models/types';

  export let resizeId: string;
  export let canvasId: string;

  const store = findStore(canvasId);
  const { resizeNodesStore } = store;

  let reactResizeNode: ResizeNodeType;
  $: reactResizeNode = $resizeNodesStore[resizeId];
</script>

<div
  class="ResizeNode"
  style="
  left: {reactResizeNode.positionX - 5}px;
  top: {reactResizeNode.positionY - 5}px;
  width: {10}px;
  height: {10}px;
  background-color: purple;
  border-color: purple;
  border-radius: 50%;"
  id="svelvet-{resizeId}"
/>

<style>
  .ResizeNode {
    position: absolute;
    display: grid;
    user-select: none;
    cursor: move;
    justify-content: center;
    overscroll-behavior: auto;
    align-items: center;
    font-size: 14px;
    text-align: center;
    border: solid 1px black;
    border-radius: 5px;
    box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.2);
  }
</style>
