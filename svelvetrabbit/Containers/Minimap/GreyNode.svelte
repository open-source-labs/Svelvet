<script>
    export let key
    export let node
    export let heightRatio
    export let widthRatio
    export let nodeXleftPosition
    export let nodeYbottomPosition
    
    //console.log(node)
    // console.log('nodeyposition' + node.position.y)
    // console.log('heightratio' + heightRatio)
    // console.log('height' + nHeight)
    // console.log('width' + nWidth)
    let top = 0;
    let left = 0;
    let nWidth = 0;
    let nHeight = 0;

    $: {
    // console.log('mapmidpoint ', mapMidpoint);
    // console.log('nodemidpoint ', nodeMidpoint);
    // top = node.position.y*heightRatio;
    // left = node.position.x*heightRatio;
    nHeight = node.height * heightRatio;
    nWidth = node.width * widthRatio;
    top = Math.max(Math.abs(nodeYbottomPosition*heightRatio) + (node.position.y * heightRatio)+5, 1)
    left = Math.max(Math.abs(nodeXleftPosition*widthRatio)+(node.position.x * widthRatio)+5, 1)
    }
    // console.log('bottom' + bottom)
    // console.log('left' + left)
    // console.log('height' + nHeight)
    // console.log('width' + nWidth)
</script>
<div class="nodes" style="top: {top}px; left: {left}px; height: {nHeight}px; width:{nWidth}px"></div>
      
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
      