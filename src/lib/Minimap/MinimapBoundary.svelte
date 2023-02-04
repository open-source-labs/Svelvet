<script>
  import { findStore } from '$lib/store/controllers/storeApi';
  import { onMount, createEventDispatcher } from 'svelte';
  import GreyNode from './GreyNodeBoundary.svelte';

  export let key;
  export let boundary;
  export let d3Translate;

  const svelvetStore = findStore(key);
  const { nodesStore, heightStore, widthStore } = svelvetStore;
  const dispatch = createEventDispatcher(); // dispatch creates a message to be sent
  let mapHeight = 100;
  let mapWidth = 100;
  let widthRatio = 1;
  let heightRatio = 1;
  let viewRight = 1;
  let viewBottom = 1;
  let map;
  let hasBeenClicked = false;

  $: {
    if (boundary.y > boundary.x) {
      mapHeight = 100;
      mapWidth = Math.max(
        (boundary.x.toFixed(0) * 100) / boundary.y.toFixed(0),
        25
      );
    } else if (boundary.y < boundary.x) {
      mapWidth = 100;
      mapHeight = Math.max(
        (boundary.y.toFixed(0) * 100) / boundary.x.toFixed(0),
        25
      );
    } else {
      mapHeight = 100;
      mapWidth = 100;
    }
    widthRatio = mapWidth / boundary.x;
    heightRatio = mapHeight / boundary.y;
    viewRight = Math.abs((d3Translate.x * widthRatio) / d3Translate.k);
    viewBottom = Math.abs((d3Translate.y * heightRatio) / d3Translate.k);
  }

  function handleClick(event) {
    if (!hasBeenClicked) {
      hasBeenClicked = true;
      let bounds = map.getBoundingClientRect();

      dispatch('message', {
        x: (event.clientX - bounds.left) / widthRatio,
        y: (event.clientY - bounds.top) / heightRatio,
      });
      setTimeout(() => {
        hasBeenClicked = false;
      }, 500);
    }
  }
</script>

<div
  on:click={handleClick}
  bind:this={map}
  class={`miniMap miniMap-${key}`}
  style="height:{mapHeight + 2}px; width:{mapWidth + 2}px;"
  on:keydown={() => {
    return;
  }}
>
  <div
    class="viewBox viewBox-{key}"
    style="height:{($heightStore * heightRatio) /
      d3Translate.k}px; width:{($widthStore * widthRatio) /
      d3Translate.k}px; top:{viewBottom}px; left:{viewRight}px;"
  />
  {#each Object.values($nodesStore) as node}
    <GreyNode {node} {key} {heightRatio} {widthRatio} />
  {/each}
</div>

<style>
  .miniMap {
    height: 100px;
    width: 100px;
    background-color: rgb(237, 236, 236);
    border: solid black;
    border-width: 1px;
    border-radius: 0.5rem;
    color: rgb(142, 142, 142);
    position: absolute;
    bottom: 15px;
    right: 15px;
    z-index: 10;
    box-shadow: 2px 2px 7px rgb(77, 77, 77);
    overflow: hidden;
  }
  .viewBox {
    background-color: rgb(120, 120, 120);
    border: solid red 1px;
    position: absolute;
  }
</style>
