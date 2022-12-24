<script>
    import { findOrCreateStore } from '../../stores/store';
    import {onMount, afterUpdate} from 'svelte'
    import GreyNode from './GreyNodeBoundary.svelte';

    export let key
    export let d3Translate
    
    const svelvetStore = findOrCreateStore(key);
    const {nodesStore} = svelvetStore;
    let mapHeight =100;
    let mapWidth = 100;
    let widthRatio = 1;
    let heightRatio = 1
    onMount(() => {
        
    })
    $: {
        if($heightStore>$widthStore){
    mapHeight = 100;
    mapWidth = Math.max(($widthStore.toFixed(0)*100)/$heightStore.toFixed(0), 25);
    }
    else if($heightStore<$widthStore){
    mapWidth = 100;
    mapHeight = Math.max(($heightStore.toFixed(0)*100)/$widthStore.toFixed(0), 25)
    }else{
    mapHeight = 100;
    mapWidth = 100;
    }
    widthRatio = mapWidth / $widthStore;
    heightRatio = mapHeight / $heightStore;
    console.log('height' +heightRatio)
    }
    </script>
    <div class={`miniMap miniMap-${key}`} style="height:{mapHeight+20}px; width:{mapWidth+20}px;">
        <!-- <div class='viewBox viewBox-{key}' style="height:{viewHeight}px; width:{viewWidth}px; top:{viewBottom}px; left:{viewRight}px;"></div> -->
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