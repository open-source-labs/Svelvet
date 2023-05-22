<script lang='ts'>
  import { Node, Svelvet, Anchor, Edge } from '$lib';
  import ThemeToggle from '$lib/components/ThemeToggle/ThemeToggle.svelte';
  import type { NodeConfig, CSSColorString } from '$lib/types';
  import { addProps } from '$lib/utils';
  
  // Array of default and custom nodes
  let defaultNodes: NodeConfig[] = [];
  let customNodes: NodeConfig[] = [];
  let anchors: any[] = [];
  let edges: any[] = [];

  let dropped_in: boolean;

  // Store that will have all default nodes
  // Store that will have all custom nodes
  // Store that will have all anchors
  // Store that will have all edges
  
  // Bind defaultNodes to the default node store
  // Bind customNodes to custom node store
  // Bind anchors to anchor store
  // bind edges to edges store

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


</script>

<div 
    class='drop_zone' 
    on:dragenter={handleDragEnter}
	on:dragleave={handleDragLeave}
	on:drop={handleDragDrop}   
    on:dragover={onDragOver}>  
    
    <Svelvet drawer height={600} zoom={0.70} minimap controls>
        {#each defaultNodes as node}
            <Node {...node} drop="cursor"/>		
        {/each}
        {#each customNodes as cNode, index}
            <Node {...cNode} drop="cursor">
                <Anchor {...anchors[index]}>
                    <!-- <Edge {...edges[index]}></Edge> -->
                </Anchor>
            </Node>			
        {/each}
        <ThemeToggle main=light alt=dark slot='toggle'/>
    </Svelvet>

</div>