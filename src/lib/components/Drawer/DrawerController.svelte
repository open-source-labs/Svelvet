<script lang="ts">
 	import type { NodeConfig, CSSColorString, Direction} from '$lib/types';
	import DrawerNode from './DrawerNode.svelte';
	import DrawerAnchor from './DrawerAnchor.svelte';
	import DrawerEdge from './DrawerEdge.svelte';

	let defaultNodes: NodeConfig[] = [];
  let customNodes: NodeConfig[] = [];
  let anchors: any[] = [];
  let edges: any[] = [];
  let customEdge: any;
  let dropped_in :boolean;
	
	const handleDragStart = (e: any)  => {
    e.dataTransfer.dropEffect = "move"; 
  }

	const handleDragEnd = (e: any) => {
    dropped_in = false;
  }
  

</script>

	<nav class ='drawerWrapper'>
			<div class='defaultNodes' draggable='true' on:dragstart={handleDragStart} on:dragend={handleDragEnd}> Node </div>
			<DrawerNode></DrawerNode>
			<DrawerAnchor></DrawerAnchor>
			<DrawerEdge></DrawerEdge>
	</nav>


<style>

.drawerWrapper{
  position: absolute;
  border-radius: 6px;
  overflow: hidden;
  left: 10px;
  top: 10px;
  /* box-shadow: var(--minimap-shadow, var(--default-minimap-shadow)); */
  border: solid 1px;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>

