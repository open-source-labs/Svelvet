<script>
    import { findOrCreateStore } from '../../stores/store';
    import {onMount, afterUpdate} from 'svelte'
    import GreyNode from './GreyNodeBoundary.svelte';

    export let key
    export let boundary
    export let d3Translate
    
    const svelvetStore = findOrCreateStore(key);
    const {nodesStore, heightStore, widthStore} = svelvetStore;
    let mapHeight =100;
    let mapWidth = 100;
    let widthRatio = 1;
    let heightRatio = 1;
    let viewRight =1;
    let viewBottom = 1;
    const scaleW = (v) => v* (mapWidth/boundary.x)
    const scaleH = (v) => v* (mapHeight/boundary.y)
    onMount(() => {
        
    })
    $: {
        if(boundary.y>boundary.x){
    mapHeight = 100;
    mapWidth = Math.max((boundary.x.toFixed(0)*100)/boundary.y.toFixed(0), 25);
    }
    else if(boundary.y<boundary.x){
    mapWidth = 100;
    mapHeight = Math.max((boundary.y.toFixed(0)*100)/boundary.x.toFixed(0), 25)
    }else{
    mapHeight = 100;
    mapWidth = 100;
    }
    widthRatio = (mapWidth / boundary.x);
    heightRatio = (mapHeight / boundary.y);
    viewRight = Math.abs(d3Translate.x*widthRatio/d3Translate.k)
    console.log('scale' + scaleW(d3Translate.x*widthRatio))
    console.log('x/k' + d3Translate.x / d3Translate.k)
    console.log('boundratio' + (boundary.x*widthRatio))
    console.log('viewRight' +viewRight)
    viewBottom = Math.abs(d3Translate.y*heightRatio/d3Translate.k)
    console.log(viewBottom)
    }
    </script>
    <div class={`miniMap miniMap-${key}`} style="height:{mapHeight+2}px; width:{mapWidth+2}px;">
        <div class='viewBox viewBox-{key}' style="height:{($heightStore*heightRatio)/d3Translate.k}px; width:{($widthStore*widthRatio)/d3Translate.k}px; top:{viewBottom}px; left:{viewRight}px;"></div>
        {#each $nodesStore as node}
          <GreyNode {node} {key} {heightRatio} {widthRatio}></GreyNode>
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