<script>
    export let key
    export let node
    export let heightRatio
    export let widthRatio

    
    let top = 0;
    let left = 0;
    let nWidth = 0;
    let nHeight = 0;

    // sets the size and position of minimap greynodes based on corresponding nodes
    $: {
        nHeight = Math.max(node.height * heightRatio, 5)
        nWidth = Math.max(node.width * widthRatio, 5)
        top = node.position.y * heightRatio
        left = node.position.x * widthRatio
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
      