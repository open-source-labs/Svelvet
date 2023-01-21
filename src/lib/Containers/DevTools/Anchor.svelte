<script lang="ts">
  import { findStore, createStore } from '$lib/stores/svelvetStore';

  export let anchor_id: string;

  const store = findStore();
  const { nodesStore, edgesStore, anchorsStore } = store;

  let reactAnchor;
  $: reactAnchor = $anchorsStore[anchor_id];
</script>

{JSON.stringify(reactAnchor)}

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
