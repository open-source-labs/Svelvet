<script lang="ts">
 	import type { NodeConfig, CSSColorString, Direction} from '$lib/types';
	import DrawerNode from './DrawerNode.svelte';
	import DrawerAnchor from './DrawerAnchor.svelte';
	import DrawerEdge from './DrawerEdge.svelte';
  import { createNodeProps } from './DrawerNode.svelte';
  import { createAnchorProps } from './DrawerAnchor.svelte'
  import { anchorPropsStore } from './DrawerAnchor.svelte';

	let defaultNodes: NodeConfig[] = [];
  let customNodes: NodeConfig[] = [];
  let anchors: any[] = [];
  let edges: any[] = [];
  let customEdge: any;
  let dropped_in :boolean;
  let nav: HTMLElement;

	const handleDragStart = (e: any)  => {
    e.dataTransfer.dropEffect = "move";
  
    // Create props for anchor if values were given
    const anchorCreated = createAnchorProps();
    // Create props for node or custom node if anchor was created
    createNodeProps(anchorCreated);
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
		<div class='defaultNodes' draggable='true' on:dragstart={handleDragStart} > Node </div>
			<DrawerNode></DrawerNode>
			<DrawerAnchor></DrawerAnchor>
			<!-- <DrawerEdge></DrawerEdge> -->
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

