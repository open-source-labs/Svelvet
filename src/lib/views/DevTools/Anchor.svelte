<script lang="ts">
  import { findStore } from '$lib/controllers/storeApi';
  import type { AnchorType } from '$lib/models/types';

  export let anchor_id: string;
  export let canvasId: string;

  const store = findStore(canvasId);
  const { nodesStore, edgesStore, anchorsStore } = store;

  let reactAnchor: AnchorType;
  $: reactAnchor = $anchorsStore[anchor_id];
</script>

<div
  class="Anchor"
  style="
  left: {reactAnchor.positionX - 5}px;
  top: {reactAnchor.positionY}px;
  width: {10}px;
  height: {10}px;
  background-color: green;
  border-color: green;
  border-radius: 50%;"
  id="svelvet-{anchor_id}"
/>

<style>
  .Anchor {
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
