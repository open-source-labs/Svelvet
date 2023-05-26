<script lang="ts">
 	import type { NodeConfig, CSSColorString, Direction} from '$lib/types';
	import DrawerNode from './DrawerNode.svelte';
	import DrawerAnchor from './DrawerAnchor.svelte';
	import DrawerEdge from './DrawerEdge.svelte';
  import { createNodeProps } from './DrawerNode.svelte';
  import { createAnchorProps } from './DrawerAnchor.svelte'
  import { createEdgeProps } from './DrawerEdge.svelte';

  let isOpen: Boolean = false;
  let nodeContainerOpen: Boolean = false;
  let edgeContainerOpen: Boolean = false;
  let anchorContainerOpen: Boolean = false;
  let nav: HTMLElement;
  let drawerBtn: HTMLElement;
  let drawerContents: HTMLElement;
  let nodeBtn: HTMLElement;
  let edgeBtn: HTMLElement;
  let anchorBtn: HTMLElement;
  let nodeContainer: HTMLElement;
  let anchorContainer: HTMLElement;
  let edgeContainer: HTMLElement;

	const handleDragStart = (e: any)  => {
    e.dataTransfer.dropEffect = "move";
  
    // Create props for anchor or edge if values were given
    const anchorCreated = createAnchorProps();
    const edgeCreated = createEdgeProps();
    // Create props for node or custom node if anchor was created
    createNodeProps(anchorCreated);
  }

  const handleDrawer = (e: any) => {
    if(!isOpen){
      isOpen = true;
      nav.style.height = '300px';
      nav.style.width = '300px';   
      drawerBtn.innerHTML ='<span class="material-symbols-outlined">north_west</span>'
    } else {
      isOpen = false;
      nav.style.height = '35px';
      nav.style.width = '35px';  
      drawerBtn.innerHTML ='<span class="material-symbols-outlined">south_east</span>'
    }
   
  } 

  const handleNodeContainer = (e: any) => {
      if(!anchorContainerOpen){
        anchorContainerOpen = true;
        nodeContainer.style.display = 'block';
        nodeBtn.innerHTML = '<span class="material-symbols-outlined ">arrow_drop_up</span>'
      } else {
        anchorContainerOpen = false;
        nodeContainer.style.display = 'none';
        nodeBtn.innerHTML = '<span class="material-symbols-outlined ">arrow_drop_down</span>'

      }
  }
  const handleEdgeContainer = (e: any) => {
    if(!edgeContainerOpen){
        edgeContainerOpen = true;
        edgeContainer.style.display = 'block';
        edgeBtn.innerHTML = '<span class="material-symbols-outlined ">arrow_drop_up</span>'
      } else {
        edgeContainerOpen = false;
        edgeContainer.style.display = 'none';
        edgeBtn.innerHTML = '<span class="material-symbols-outlined ">arrow_drop_down</span>'

      }
  }
  const handleAnchorContainer = (e: any) => {
    if(!anchorContainerOpen){
        anchorContainerOpen = true;
        anchorContainer.style.display = 'block';
        anchorBtn.innerHTML = '<span class="material-symbols-outlined ">arrow_drop_up</span>'
      } else {
        anchorContainerOpen = false;
        anchorContainer.style.display = 'none';
        anchorBtn.innerHTML = '<span class="material-symbols-outlined ">arrow_drop_down</span>'

      }
  }


</script>


	
	<nav id ='drawerWrapper' bind:this = {nav} >
    <slot>
    <button class='drawerBtn' bind:this = {drawerBtn} on:click={handleDrawer}>
      <span class="material-symbols-outlined">south_east</span>
    </button>  
		<ul class='drawerContents' bind:this = {drawerContents}>
      <!-- Handle Node Dropdown -->  			
			<li class='list-item'>				
          <div class='label'>Node
            <button class='dropdown' bind:this = {nodeBtn} on:click={handleNodeContainer}>
              <span class="material-symbols-outlined ">arrow_drop_down</span>
            </button>
          </div>
          <hr/>
          <div class='propsContainer nodeContainer' bind:this={nodeContainer}>
            <DrawerNode></DrawerNode>
          </div>         
			</li>
      <!-- Handle Edge Dropdown -->
      <li class='list-item'>
				<div class= 'label'>Edge
          <button class='dropdown' bind:this = {edgeBtn} on:click={handleEdgeContainer}>
            <span class="material-symbols-outlined ">arrow_drop_down</span>
          </button>
       </div>
        <hr/>
        <div class='propsContainer edgeContainer' bind:this = {edgeContainer}>          
          <DrawerEdge></DrawerEdge>
        </div>        
			</li>	
      <!-- Handle Anchor Dropdown -->
			<li class='list-item'>
				<div class='label'>Anchor
          <button class='dropdown'  bind:this = {anchorBtn} on:click={handleAnchorContainer}>
            <span class="material-symbols-outlined ">arrow_drop_down</span>
          </button>
        </div>
        <hr/>
        <div class='propsContainer anchorContainer' bind:this = {anchorContainer}>
          <DrawerAnchor></DrawerAnchor>
        </div>      
			</li>
			
      <li class='list-item'>
				<div class='defaultNodes' draggable='true' on:dragstart={handleDragStart}> Node </div>
			</li>
     	
		</ul>
    </slot>
	</nav>  
		



 
<style>

#drawerWrapper{
  position: absolute;
  width: 35px;
  height: 35px;
  border-radius: 6px;
  left: 10px;
  top: 10px;
  border: solid 1px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: 1s;
  padding-top: 10px;
  cursor:auto;
  color: var(
			--prop-controls-text-color,
			var(--controls-text-color, var(--default-controls-text-color))
		);
		background-color: var(
			--prop-controls-background-color,
			var(--controls-background-color, var(--default-controls-background-color))
		);
}

#drawerWrapper ul{
  display: flex;
  flex-direction: column;
  list-style: none;
  width: 100%;
  text-decoration: none;
  font-size: 20px;
  overflow: hidden; 
  transition: 0.3s;
  padding: 0;

}
#drawerWrapper li:first-child{
  margin-top: 10px;
}
.drawerBtn {
  position: fixed;
  display: flex;
  align-items: center;
	justify-content: center;
  top: 20px;
  left: 20px;
  font-size: 20px;
  cursor: pointer;
  padding: 0.2rem 0;
  border: none;
  background: none;
  color: inherit;
  
}

 .list-item .label{
   display: flex;
   justify-content: space-between;
   padding-left: 10px;
   margin-top: 10px;
   margin-bottom: 0;
 }
 .list-item .label .dropdown{
  padding: 0 10px;
  font-size: 1.2rem; 
  cursor: pointer;
  border: none;
  background: none;
  color: inherit;
  
 }

  span {
		font-family: 'Material Symbols Outlined';
		font-size: 1.2rem;
		color: inherit;
	}
  .defaultNodes{
    margin: auto;
    margin-top: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    width: 120px;
    cursor: grab;       
		border-radius:8px;
		background-color: var(--prop-background-color, var(--node-color, var(--default-node-color)));
		color: var(--prop-text-color, var(--text-color, var(--default-text-color)));
		box-shadow: 0 0 0 var(--final-border-width) var(--final-border-color),
			var(--default-node-shadow);
    }
	button:hover {
		cursor: pointer;
	}

  .propsContainer{
    height: fit-content;
    width: fit-content;
    overflow: hidden;
    padding: 0 18px;
  }

  .nodeContainer{
    display: none;
  }
  .edgeContainer{
    display: none;
  }
  .anchorContainer{
    display: none;
  }

</style>

