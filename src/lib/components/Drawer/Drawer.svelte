<script lang='ts'>
  import { Node, Svelvet, Anchor } from '$lib';
	import type { SvelvetConfig , NodeConfig, XYPair, EdgeStyle } from '$lib/types';
  import type { ComponentType } from 'svelte';
  import  { defaultNodePropsStore, customNodePropsStore } from './DrawerNode.svelte'
  import { anchorPropsStore } from './DrawerAnchor.svelte';
	import type { AnchorProps } from '$lib/types/props/anchorProps';


  // Props
  export let width: number = 0;
  export let height: number = 0;
  export let minimap: boolean = false;
  export let translation: XYPair = { x: 0, y: 0 };
  export let controls: boolean = false;
  export let edge: ComponentType | null = null;
  export let edgeStyle: EdgeStyle = 'bezier';
  export let snapTo: number = 0;
  export let editable: boolean = false;
  export let fitView: boolean | 'resize' = false;
  export let locked: boolean = false;
  export let zoom: number = 1;
  export let theme: string = 'light';
  export let mermaid: string = '';
  export let mermaidConfig: Record<string, NodeConfig> = {};
  export let TD: boolean = false;
  export let disableSelection: boolean = false;
  export let raiseEdgesOnSelect: boolean | 'source' | 'target' = false;
  export let modifier: 'alt' | 'ctrl' | 'shift' | 'meta' = 'meta';
  export let trackpadPan: boolean = false;
  export let toggle: boolean = false;

  // Store props in object to be passed to svelvet
  const sveltetProps: SvelvetConfig = {
    width,
    height,
    minimap,
    translation,
    controls,
    edge,
    edgeStyle,
    snapTo,
    editable,
    fitView,
    locked,
    zoom,
    theme,
    mermaid,
    mermaidConfig,
    TD,
    disableSelection,
    raiseEdgesOnSelect,
    modifier,
    trackpadPan,
    toggle,
  }
  
  // Array of default and custom nodes, anchors
  let defaultNodes: NodeConfig[] = [];
  let customNodes: NodeConfig[] = [];
  let anchors: any = [];
  let dropped_in: boolean;

  // Drag and drop events
  const handleDragEnter = (e: DragEvent): void => {
    dropped_in = true;
  }

  const handleDragLeave = (e: DragEvent): void => {
    dropped_in = false;
  }

  const handleDragEnd = (e: DragEvent): void => {
    dropped_in = false;
  }

  const onDragOver = (e: DragEvent): boolean => {
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
	};


</script>

<div
  class='drop_zone' 
  on:dragenter={handleDragEnter}
	on:dragleave={handleDragLeave}
  on:dragover={onDragOver}
  on:drop={handleDrop}
  > 
  
    <Svelvet {...sveltetProps} drawer>
        {#each defaultNodes as node, index}
            <Node {...node} drop="cursor"></Node>
        {/each}

        {#each customNodes as customNode, index}
            <Node {...customNode} drop="cursor">
              {#if Array.isArray(anchors[index])}
                {#each anchors[index] as anchorProp}
                  <div class={anchorProp.direction}>
                    <Anchor {...anchorProp}></Anchor>
                  </div>
                {/each}  
              {:else}
                <div class={anchors[index].direction}>
                  <Anchor {...anchors[index]} />
                </div>
              {/if}
            </Node>			
        {/each}

        <slot/>
        <slot name="minimap" slot="minimap" />
        <slot name="controls" slot="controls" />
        <!-- <slot name="background" slot='background'></slot>  -->
        <slot name="toggle" slot="toggle" />
    </Svelvet>
    
</div>

<style>
  /* Styling for anchor position */
  .west {
    transform: translate(-50%); 
    position: absolute;
    left: 0;
	}

  .east {
    transform: translate(50%); 
    position: absolute;
    right: 0;
	}

  .north {
    transform: translate(0, -50%); 
    position: absolute;
    top: 0;
	}
 
	.south {
    transform: translate(0, 50%);
    position: absolute;
    bottom: 0;

	}

</style>