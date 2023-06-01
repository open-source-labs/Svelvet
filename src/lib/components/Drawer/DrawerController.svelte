<script lang="ts">
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
  let nodeBtn: HTMLElement;
  let edgeBtn: HTMLElement;
  let anchorBtn: HTMLElement;
  let drawerContents: HTMLElement;
  let nodeContainer: HTMLElement;
  let anchorContainer: HTMLElement;
  let edgeContainer: HTMLElement;

	const handleDragStart = (e: any)  => {
    e.dataTransfer.dropEffect = "move";
  
    // Create props for anchor or edge if values were given
    const anchorCreated = createAnchorProps(true);
    const edgeCreated = createEdgeProps(anchorCreated);

    // Create props for node
    createNodeProps(edgeCreated, anchorCreated);
  }

  const handleDrawer = (e: any) => {
    if(!isOpen){
      isOpen = true;
      nav.style.height = 'fit-content';
      nav.style.width = '300px';   
      drawerBtn.innerHTML ='<span class="material-symbols-outlined">north_west</span>'
    } else {
      isOpen = false;
      nav.style.height = '35px';
      nav.style.width = '35px';  
      drawerBtn.innerHTML ='<span class="material-symbols-outlined">south_east</span>'
      anchorContainerOpen = false;
      edgeContainerOpen = false;
      nodeContainerOpen = false;
      nodeContainer.style.display = 'block';
      edgeContainer.style.display = 'none';
      anchorContainer.style.display = 'none';
      nodeBtn.style.borderBottom = '3px solid var(--prop-drawer-button-text-color,var(--drawer-button-text-color, var(--default-drawer-button-text-color)))';
      edgeBtn.style.borderBottom = 'none';
      anchorBtn.style.borderBottom = 'none';
    }
   
  } 

  const handleNodeContainer = (e: any) => {
      if(!nodeContainerOpen){
        nodeContainerOpen = true;
        anchorContainerOpen = false;
        edgeContainerOpen = false;
        nodeContainer.style.display = 'block';
        edgeContainer.style.display = 'none';
        anchorContainer.style.display = 'none';
        nodeBtn.style.borderBottom = '3px solid var(--prop-drawer-button-text-color,var(--drawer-button-text-color, var(--default-drawer-button-text-color)))';
        edgeBtn.style.borderBottom = 'none';
        anchorBtn.style.borderBottom = 'none';
      }
  }
  const handleAnchorContainer = (e: any) => {
    if(!anchorContainerOpen){
        anchorContainerOpen = true;
        edgeContainerOpen = false;
        nodeContainerOpen = false;
        anchorContainer.style.display = 'block';
        edgeContainer.style.display = 'none';
        nodeContainer.style.display = 'none';
        nodeBtn.style.borderBottom = 'none';
        edgeBtn.style.borderBottom = 'none';
        anchorBtn.style.borderBottom = '3px solid var(--prop-drawer-button-text-color,var(--drawer-button-text-color, var(--default-drawer-button-text-color)))';
  
      }
  }
  const handleEdgeContainer = (e: any) => {
    if(!edgeContainerOpen){
         edgeContainerOpen = true;
         nodeContainerOpen = false;
         anchorContainerOpen = false;
        edgeContainer.style.display = 'block';
        anchorContainer.style.display = 'none';
        nodeContainer.style.display = 'none';
        nodeBtn.style.borderBottom = 'none';
        edgeBtn.style.borderBottom = '3px solid var(--prop-drawer-button-text-color,var(--drawer-button-text-color, var(--default-drawer-button-text-color)))';
        anchorBtn.style.borderBottom = 'none';
      }
  }

</script>
	
	<nav id ='drawerWrapper' bind:this = {nav} >
    <slot>
    <button class='drawerBtn' bind:this = {drawerBtn} on:click={handleDrawer} aria-label="Open/Close Drawer">
      <span class="material-symbols-outlined">south_east</span>
    </button>  
		<ul class='drawerContents' bind:this = {drawerContents}>		
			<li class='list-item'>	
        <div class='menu'>
          <button class='dropdown' bind:this = {nodeBtn} on:click={handleNodeContainer} aria-label="Component">
            Node
           </button>
           <button class='dropdown' bind:this = {anchorBtn} on:click={handleAnchorContainer} aria-label="Component">
            Anchor
         </button>
         <button class='dropdown' bind:this = {edgeBtn} on:click={handleEdgeContainer} aria-label="Component">
            Edge
        </button>
        </div>			          
      </li>
          <!-- Handle Node Dropdown -->  	
      <li class='list-item'>
          <div class='propsContainer nodeContainer' bind:this={nodeContainer}>
            <DrawerNode></DrawerNode>
          </div>         
			</li>
      <!-- Handle Anchor Dropdown -->
			<li class='list-item'>      
        <div class='propsContainer anchorContainer' bind:this = {anchorContainer}>
          <DrawerAnchor></DrawerAnchor>
        </div>      
			</li>
      <!-- Handle Edge Dropdown -->
      <li class='list-item'>
        <div class='propsContainer edgeContainer' bind:this = {edgeContainer}>          
          <DrawerEdge></DrawerEdge>
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
  height: 30px;
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
  margin-top: 45px;

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
.menu{
  display: flex;
  justify-content: space-between;
}

 .menu .dropdown{ 
  padding: 10px;
  font-size: 1.0rem; 
  flex-grow: 1;
  cursor: pointer;
  border: none;
  margin: 0;
  color:  var(
			--prop-drawer-button-text-color,
			var(--drawer-button-text-color, var(--default-drawer-button-text-color))
		);
  background-color: var(
			--prop-drawer-button-color,
			var(--drawer-button-color, var(--default-drawer-button-color))
		);
 }


 .menu .dropdown:first-child{
  border-bottom: 3px solid var(--prop-drawer-button-text-color,var(--drawer-button-text-color, var(--default-drawer-button-text-color)));
 }

  span {
		font-family: 'Material Symbols Outlined';
		font-size: 1.2rem;
		color: inherit;
	}
  .defaultNodes{
    margin: auto;
    margin-top: 15px;
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
    margin-top: 20px;
  }

  .nodeContainer{
    display: block;
  }
  .edgeContainer{
    display: none;
  }
  .anchorContainer{
    display: none;
  }

</style>

