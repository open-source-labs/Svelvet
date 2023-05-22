<script context='module' lang="ts">
  import {onMount} from 'svelte';
 	import type { NodeConfig, CSSColorString, Direction} from '$lib/types';
	import DrawerNode from './DrawerNode.svelte';
	import DrawerAnchor from './DrawerAnchor.svelte';
	import DrawerEdge from './DrawerEdge.svelte';

  // import { createEventDispatcher } from 'svelte';
  // const dispatch = createEventDispatcher();

	let defaultNodes: NodeConfig[] = [];
  let customNodes: NodeConfig[] = [];
  let anchors: any[] = [];
  let edges: any[] = [];
  let customEdge: any;
  let dropped_in :boolean;
  let nav: HTMLElement;

	const handleDragStart = (e: any)  => {
    e.dataTransfer.dropEffect = "move";
  }

	const handleDragEnd = (e: any) => {
    dropped_in = false;
  }

   const openDrawer = (e: any) => {
    console.log('open btn clicked');
   nav.style.backgroundColor = 'red';
  }

  const closeDrawer = () => {
    nav.style.width = '0px';
  }

 

</script>

<div>
 
	<nav id ='drawerWrapper' bind:this={nav} >
    <button class='openbtn' on:click={openDrawer}>Open Drawer</button>
    <button class='closebtn' on:click={closeDrawer}>x</button>   
		<div class='defaultNodes' draggable='true' on:dragstart={handleDragStart} on:dragend={handleDragEnd}> Node </div>
			<DrawerNode></DrawerNode>
			<!-- <DrawerAnchor></DrawerAnchor>
			<DrawerEdge></DrawerEdge> -->
	</nav>
  <!-- <button class='openbtn' on:click={openDrawer}>Open Drawer</button> -->
</div>

 
<style>

#drawerWrapper{
  position: absolute;
  width: 250px;
  min-height: 600px;
  border-radius: 6px;
  overflow-y: auto;
  left: 10px;
  top: 20px;
  /* box-shadow: var(--minimap-shadow, var(--default-minimap-shadow)); */
  border: solid 1px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.openbtn {
  font-size: 20px;
  cursor: pointer;
  background-color: #111;
  color: white;
  padding: 10px 15px;
  border: none;
}

</style>

