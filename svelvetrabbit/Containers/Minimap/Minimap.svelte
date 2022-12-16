<script>
    import { findOrCreateStore } from '../../stores/store';
    import {onMount, afterUpdate} from 'svelte'
    import GreyNode from './GreyNode.svelte';
    export let key
    
    const svelvetStore = findOrCreateStore(key);
    const {nodesStore} = svelvetStore;
    onMount(() => {
        
    })
    // variable to first initialize the size of the map
    let firstGo = true;
    //placeholdervalues for initialization
    let mapMax = 100
    let mapWidth = mapMax;
    let mapHeight = mapMax;
    let nodeHeight = mapMax-10;
    let nodeWidth = mapMax -1;
    let heightRatio = 1;
    let widthRatio = 1;
    let nodeMidpoint = {x:50, y:50}
    let mapMidpoint = {x:50, y:50}
    let nodeXleftPosition = Infinity;
    let nodeYtopPosition = -Infinity;
    let nodeYbottomPosition = Infinity;
    let nodeXrightPosition = -Infinity;
    
    
    // reactive object that updates every time nodesStore is updated
    $: {
    if(firstGo){
    //sets initial position values for furthest nodes
    $nodesStore.forEach((node) => {
    nodeXleftPosition = Math.min(nodeXleftPosition, node.position.x)
    nodeXrightPosition = Math.max(nodeXrightPosition, node.position.x)
    nodeYbottomPosition = Math.min(nodeYbottomPosition, node.position.y)
    nodeYtopPosition = Math.max(nodeYtopPosition, node.position.y)
    });
    // set height and width
    nodeHeight = nodeYtopPosition - nodeYbottomPosition;
    nodeWidth = nodeXrightPosition - nodeXleftPosition;

    // reassign midpoint
    nodeMidpoint = {x: nodeWidth / 2, y: nodeHeight / 2}

    //ends the first round
    firstGo=!firstGo}
    else{
        //reassign node positions for reassignment within updated store
    nodeXleftPosition = Infinity;
    nodeYtopPosition = -Infinity;
    nodeYbottomPosition = Infinity;
    nodeXrightPosition = -Infinity;

    $nodesStore.forEach((node) => {
    nodeXleftPosition = Math.min(nodeXleftPosition, node.position.x)
    nodeXrightPosition = Math.max(nodeXrightPosition, node.position.x)
    nodeYbottomPosition = Math.min(nodeYbottomPosition, node.position.y)
    nodeYtopPosition = Math.max(nodeYtopPosition, node.position.y)
    })
    // sets the height, width, and midpoint of nodes after movement
    nodeHeight = Math.abs(nodeYbottomPosition - nodeYtopPosition);
    nodeWidth = Math.abs(nodeXleftPosition -nodeXrightPosition);
    nodeMidpoint = {x: nodeWidth / 2, y: nodeHeight / 2}
    }
    // console.log(nodeXleftPosition);
    // console.log(nodeXrightPosition);
    // console.log(nodeYbottomPosition);
    // console.log(nodeYtopPosition);
    // nodeHeight = nodeYtopPosition - nodeYbottomPosition;
    // nodeWidth = nodeXrightPosition - nodeXleftPosition;
    // console.log(nodeHeight)
    //  console.log(nodeWidth)

    if(nodeHeight>nodeWidth){
    mapHeight = 100;
    mapWidth = Math.max((nodeWidth.toFixed(0)*100)/nodeHeight.toFixed(0), 25);
    }
    else if(nodeHeight<nodeWidth){
    mapWidth = 100;
    mapHeight = Math.max((nodeHeight.toFixed(0)*100)/nodeWidth.toFixed(0), 25)
    }else{
    mapHeight = 100;
    mapWidth = 100;
    }
    mapMidpoint = {x: mapWidth / 2, y: mapHeight / 2}
    heightRatio = ((mapHeight-20) / nodeHeight).toFixed(2);
    widthRatio = ((mapWidth-20) / nodeWidth).toFixed(2);
    
    }
    //get a scale factor from nodeheight and width
    //use that scaling factor to make virtual representation of nodes bigger or smaller 
    //depending on the height and width of the overall structure including all nodes
    //
    //
    
    </script>
    <div class={`miniMap`} style="height:{mapHeight}px; width:{mapWidth}px">
        {#each $nodesStore as node}
          <GreyNode {node} {key} {heightRatio} {widthRatio} {mapMidpoint} {nodeMidpoint}></GreyNode>
        {/each}
    </div>
    <style>
    .miniMap {
        height: 100px;
        width: 100px;
        background-color: rgb(237, 236, 236);
        border: solid black;
        border-width: 1px;
        border-radius: .5rem;
        color: aqua;
        position: absolute;
        bottom: 15px;
        right: 15px;
        z-index:10;
        box-shadow: 2px 2px 7px rgb(77, 77, 77);
    }
    </style>