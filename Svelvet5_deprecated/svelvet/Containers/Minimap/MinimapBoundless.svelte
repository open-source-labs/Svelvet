<script>
    import { findOrCreateStore } from '../../stores/store';
    import {onMount, createEventDispatcher} from 'svelte'
    import GreyNode from './GreyNodeBoundless.svelte';

    export let key
    export let d3Translate;
    
    const svelvetStore = findOrCreateStore(key);
    const {nodesStore, widthStore, heightStore} = svelvetStore;
    
    //placeholdervalues for initialization
    //dispatch for message to be sent
    const dispatch = createEventDispatcher();

    let mapMax = 100
    let mapWidth = mapMax;
    let mapHeight = mapMax;
    let nodeHeight = mapMax - 10;
    let nodeWidth = mapMax - 10;
    let viewHeight = 10;
    let viewWidth = 10;
    let viewRight = 10;
    let viewBottom = 10;
    let heightRatio = 1;
    let widthRatio = 1;
    let nodeXleftPosition = Infinity;
    let nodeYtopPosition = -Infinity;
    let nodeYbottomPosition = Infinity;
    let nodeXrightPosition = -Infinity;
    let map; // y position within the element.
    let hasBeenClicked = false;
    const scaleW = (v) => v * (mapWidth / nodeWidth)
    const scaleH = (v) => v * (mapHeight / nodeHeight)
    
    $:{
        nodeXleftPosition = Infinity;
        nodeYtopPosition = -Infinity;
        nodeYbottomPosition = Infinity;
        nodeXrightPosition = -Infinity;

        // looks for the top-most, bottom-most, left-most, right-most values for the furthest node in those perspective values to find the boundaries of the size of the diagram
        $nodesStore.forEach((node) => {
            nodeXleftPosition = Math.min(nodeXleftPosition, node.position.x)
            nodeXrightPosition = Math.max(nodeXrightPosition, node.position.x)
            nodeYbottomPosition = Math.min(nodeYbottomPosition, node.position.y)
            nodeYtopPosition = Math.max(nodeYtopPosition, node.position.y)
      })
        // sets the height, width of nodes after movement
        nodeHeight = nodeYtopPosition - nodeYbottomPosition;
        nodeWidth = nodeXrightPosition - nodeXleftPosition;
        
        if(nodeHeight > nodeWidth){
          mapHeight = 100;
          mapWidth = Math.max((nodeWidth.toFixed(0)*100)/nodeHeight.toFixed(0), 25);
        }
        else if(nodeHeight < nodeWidth){
          mapWidth = 100;
          mapHeight = Math.max((nodeHeight.toFixed(0)*100)/nodeWidth.toFixed(0), 25)
        } else {
          mapHeight = 100;
          mapWidth = 100;
        }
        heightRatio = (mapHeight / nodeHeight).toFixed(2);
        widthRatio = (mapWidth / nodeWidth).toFixed(2);

        // determining the positioning and the size of the viewbox
        viewRight = (scaleW((d3Translate.x * widthRatio) - d3Translate.x / d3Translate.k)) - (nodeXleftPosition * widthRatio); 
        viewBottom = (scaleH((d3Translate.y * heightRatio) - d3Translate.y / d3Translate.k)) - (nodeYbottomPosition * heightRatio);
        
        viewWidth = ($widthStore * widthRatio) / d3Translate.k;
        viewHeight = ($heightStore * heightRatio) / d3Translate.k;
    }
    //get a scale factor from nodeheight and width
    //use that scaling factor to make virtual representation of nodes bigger or smaller 
    //depending on the height and width of the overall structure including all nodes
    function handleClick(event) {
      if(!hasBeenClicked){
        //bounds grabs map variable coordinates on the map relative to the websites position
        let bounds = map.getBoundingClientRect();
		
        hasBeenClicked = true
        dispatch('message', {
			    x:nodeXleftPosition+((event.clientX - bounds.left)/widthRatio),
          y: nodeYbottomPosition+((event.clientY - bounds.top)/heightRatio),
		    });
        //throttles clicks to prevent map distortion
      setTimeout(() => {
            hasBeenClicked = false;
      }, 500);
  
  }


	}
    </script>
    <div on:click={handleClick} bind:this={map} class={`miniMap miniMap-${key}`} style="height:{mapHeight+20}px; width:{mapWidth+20}px;" on:keydown={()=> {return}}>
        <div class='viewBox viewBox-{key}' style="height:{viewHeight}px; width:{viewWidth}px; top:{viewBottom}px; left:{viewRight}px;"></div>
        {#each $nodesStore as node}
          <GreyNode {node} {key} {heightRatio} {widthRatio} {nodeXleftPosition} {nodeYbottomPosition}></GreyNode>
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
        color: rgb(142, 142, 142);
        position: absolute;
        bottom: 15px;
        right: 15px;
        z-index:10;
        box-shadow: 2px 2px 7px rgb(77, 77, 77);
        overflow: hidden;
    }
    .viewBox{
        background-color: rgb(120, 120, 120);
        border: solid red 1px;
        position: absolute;
    }
    </style>