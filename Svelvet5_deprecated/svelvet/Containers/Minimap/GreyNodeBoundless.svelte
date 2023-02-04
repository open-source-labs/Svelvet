<script>
  export let key;
  export let node;
  export let heightRatio;
  export let widthRatio;
  export let nodeXleftPosition;
  export let nodeYbottomPosition;

  let top = 0;
  let left = 0;
  let nWidth = 0;
  let nHeight = 0;
  //nHeight/nWidth represent the height and width of the grey nodes
  //top/left represent the actual position of the grey nodes on the minimap

  $: {
    nHeight = Math.max(node.height * heightRatio, 5);
    nWidth = Math.max(node.width * widthRatio, 5);
    top = node.position.y * heightRatio - nodeYbottomPosition * heightRatio + 1;
    left = node.position.x * widthRatio - nodeXleftPosition * widthRatio + 1;
  }
</script>

<div
  class="nodes nodes-{key}"
  style="top: {top}px; left: {left}px; height: {nHeight}px; width:{nWidth}px"
/>

<style>
  .nodes {
    position: absolute;
    background-color: black;
    color: black;
    opacity: 20%;
    z-index: 9;
    border-radius: 0.1rem;
  }
</style>
