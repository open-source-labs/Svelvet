<script lang='ts'>
  import { Node, Svelvet, Anchor, Edge } from '$lib';
  import ThemeToggle from '$lib/components/ThemeToggle/ThemeToggle.svelte';
  import type { NodeConfig, CSSColorString, EdgeConfig } from '$lib/types';
  import  { defaultNodePropsStore } from './DrawerNode.svelte'
  import  { customNodePropsStore } from './DrawerNode.svelte';
  import { anchorPropsStore } from './DrawerAnchor.svelte';
  import { edgePropsStore } from './DrawerEdge.svelte';
	import type { ComponentType } from 'svelte';

  // Array of default and custom nodes
  let defaultNodes: NodeConfig[] = [];
  let customNodes: NodeConfig[] = [];
  let anchors: any[] = [];
  let edges: EdgeConfig[] = [];
  let edgeComponentArray: ComponentType[] = [];

  let edgeCreated: boolean;
  let dropped_in: boolean;

  // Drag and drop events
  const handleDragEnter = (e: any) => {
    dropped_in = true;
  }

  const handleDragLeave = (e: any) => {
    dropped_in = false;
  }

  const handleDragEnd = (e: any) => {
    dropped_in = false;
  }

  const onDragOver = (e: Event) => {
    e.preventDefault();
    return false;
  };

  const handleDrop = (e: any) => {
		e.stopPropagation();
		//Issue click event
		const moveEvent = new MouseEvent('mousemove', {
			clientX: e.clientX,
			clientY: e.clientY,
			bubbles: true
		});
		e.target.dispatchEvent(moveEvent);

    defaultNodes = $defaultNodePropsStore;
    customNodes = $customNodePropsStore;
    anchors = $anchorPropsStore;

   
    edges = $edgePropsStore;
    

    console.log(edges);
    if(edges.length >= 1) edgeCreated = true;
	};

</script>

<div
  class='drop_zone' 
  on:dragenter={handleDragEnter}
	on:dragleave={handleDragLeave}
  on:dragover={onDragOver}
  on:drop={handleDrop}
  > 
  
    <Svelvet drawer height={1200} zoom={0.70} minimap controls>
        {#each defaultNodes as node, index}
            <Node {...node} drop="cursor"></Node>
        {/each}
        
        <!-- {#each edges as edge}
          <Node drop='cursor' edge={DrawerEdgeCreator}></Node>
        {/each} -->

        {#each customNodes as customNode, index}
            {#if edgeCreated}
            <Node {...customNode} drop="cursor">
              {#each edges as edge}
                <Anchor {...anchors[index]} edge={{edge}}>
                </Anchor>
              {/each} 
            </Node>
            {:else}
              <Node {...customNode} drop="cursor">
                <Anchor {...anchors[index]} >
                </Anchor>
            </Node>	
            {/if}
        {/each}
        <slot></slot>
        <ThemeToggle main=light alt=dark slot='toggle'/>
    </Svelvet>
    
</div>