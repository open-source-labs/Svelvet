<script>
    export let key
    export let node
    export let heightRatio
    export let widthRatio
    export let nodeXleftPosition
    export let nodeYbottomPosition
    
    let top = 0;
    let left = 0;
    let nWidth = 0;
    let nHeight = 0;

    $: {
    nHeight = node.height * heightRatio;
    nWidth = node.width * widthRatio;
    top = Math.abs(nodeYbottomPosition*heightRatio) + (node.position.y * heightRatio)
    left = Math.abs(nodeXleftPosition*widthRatio)+(node.position.x * widthRatio)
    }

</script>
<div class="nodes nodes-{key}" style="top: {top}px; left: {left}px; height: {nHeight}px; width:{nWidth}px"></div>
      
<style>
.nodes{
    position:absolute;
    background-color: black;
    color: black;
    opacity: 20%;
    z-index: 9;
    border-radius: .1rem;
}
</style>
      