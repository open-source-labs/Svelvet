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
  let isOpen: boolean = false;
  let nav: HTMLElement;
  let drawerBtn: HTMLElement;

	const handleDragStart = (e: any)  => {
    e.dataTransfer.dropEffect = "move";
  }

	const handleDragEnd = (e: any) => {
    dropped_in = false;
  }

  const handleDrawer = (e: any) => {
    if(!isOpen){
      isOpen = true;
      nav.style.height = '300px';
      nav.style.width = '300px';
      drawerBtn.innerHTML ='<span class="material-symbols-outlined">close</span>'
    } else {
      isOpen = false;
      nav.style.height = '35px';
      nav.style.width = '40px';
      drawerBtn.innerHTML ='<span class="material-symbols-outlined">south_east</span>'
    }
   
  } 

</script>


	
	<nav id ='drawerWrapper' bind:this = {nav} >
    <slot>
    <button class='openbtn' bind:this = {drawerBtn} on:click={handleDrawer}>
      <span class="material-symbols-outlined">south_east</span>
    </button>  
		<ul>  
        
			
			<li class='list-item'>
				
          <div>Node</div>
          <hr/>
    
			</li>
			<li class='list-item'>
				<div>Anchor</div>
        <hr/>
			</li>
			<li class='list-item'>
				<div>Edge</div>
        <hr/>
			</li>	
      <li class='list-item'>
				<div class='defaultNodes' draggable='true' on:dragstart={handleDragStart} on:dragend={handleDragEnd}> Node </div>
			</li>
     	
		</ul>
    </slot>
	</nav>  
		



 
<style>

#drawerWrapper{
  position: absolute;
  width: 40px;
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
  list-style: none;
  text-decoration: none;
  font-size: 25px;
  overflow: hidden;
  transition: 0.3s;  
}

.openbtn {
  position: fixed;
  top: 20px;
  left: 20px;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border: none;
  
}

button {
		margin: 0;
		padding: 0;
		border: none;
		background: none;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.2rem 0;
		border-bottom: solid 1px rgb(190, 188, 188);
		color: inherit;
	}

  span {
		font-family: 'Material Symbols Outlined';
		font-size: 1.2rem;
		color: inherit;
	}
	/* button:last-child {
		border-bottom: none;
	} */
	button:hover {
		cursor: pointer;
	}

</style>

