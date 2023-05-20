<script lang='ts'>
  import { Node, Svelvet, Anchor, Edge } from '$lib';
  import ThemeToggle from '$lib/components/ThemeToggle/ThemeToggle.svelte';
  import type { NodeConfig, CSSColorString } from '$lib/types';
  import { addProps } from '$lib/utils';

   let defaultNodes: NodeConfig[] = [];
   let customNodes: NodeConfig[] = [];
   let anchors: any[] = [];
   let edges: any[] = [];
   let customEdge: any;
   let dropped_in :boolean;

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

    const handleDragStart = (e: any)  => {
        e.dataTransfer.dropEffect = "move"; 
    }



   const handleDragDrop = (e: any) => {
        e.preventDefault();
        const moveEvent = new MouseEvent('mousemove', {
			clientX: e.clientX,
			clientY: e.clientY,
			bubbles: true
		});
		e.target.dispatchEvent(moveEvent);
        dropped_in = true;
        
        // Object that stores properties for the created node
        const nodeProps: any = {};
        // Array of property names and values for node
        const nodePropNames: any[] = ['bgColor', 'borderColor','label', 'width', 'height', 'locked', 'center', 'inputs', 'outputs', 'rotation', 'zIndex', 'TD', 'LR', 'useDefaults'];
        const nodePropsArray: any[] = [bgColor, borderColor, label, width, height, locked, center, inputs, outputs, rotation, zIndex, TD, LR, useDefaults];
       // Adds props to object if they exist
        const addProp = (names: any, vals : any, nodeProps : any): any => {
            for (let i = 0; i < names.length; i++) {
                if(vals[i]) nodeProps[names[i]] = vals[i];
            }
        }
        
        // Add props to node if they exist 
        addProp(nodePropNames, nodePropsArray, nodeProps);

         // Object that stores properties for the created anchor
        const anchorProps: any = {};
        // Array of property names and values for anchor
        const anchorPropNames: any[] = ['invisible', 'nodeConnect', 'input', 'output', 'multiple', 'dynamic', 'edgeLabel', 'direction', 'locked', 'bgColor'];
        const anchorPropsArray: any[] = [invisible, nodeConnect, input, output, multiple, dynamic, anchorEdgeLabel, direction, anchorLocked, anchorBgColor];
        // Adds props to anchor if they exist
        addProp(anchorPropNames, anchorPropsArray, anchorProps);

        // Objec that stores properties for the created edge
        const edgeProps: any = {};
        // Array of property names and values for edge
        const edgePropsNames: any[] = ['width', 'targetColor', 'color', 'straight', 'step', 'cornerRadius', 'animate', 'label', 'labelColor', 'textColor'];
        const edgePropsArray: any[] = [edgeWidth, targetColor, color, straight, step, cornerRadius, animate, edgeLabel, labelColor, textColor];
        // Add props to edge if they exist
        addProp(edgePropsNames, edgePropsArray, edgeProps);

        // If anchor props were given to create an anchor, an anchor has been created
        if (Object.keys(anchorProps).length) {
            // Add custom node to array and push the custom props
            customNodes = [...customNodes, {...nodeProps}]
            anchors.push(anchorProps)

            //If edge props were given to create an achor, a custom edge has been created
            if(Object.keys(edgeProps).length) {
                // Add edge props to edge array
                edges.push({...edgeProps});
                
            }
            
        } else {
            defaultNodes = [...defaultNodes, {...nodeProps}];
        }
    }

</script>

<div 
    class='drop_zone' 
    on:dragenter={handleDragEnter}
	on:dragleave={handleDragLeave}
	on:drop={handleDragDrop}   
    on:dragover = {onDragOver}>  
    


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

<div class="toolbox">
	<h3 class="title">Toolbox</h3>
	<ul class="toolbox-items">
		<li class="list-item" draggable="true" data-value="green" on:dragstart={handleDragDrop}>
			<div class="icon green" />
			Green Square
		</li>
		<li class="list-item" draggable="true" data-value="blue" on:dragstart={handleDragDrop}>
			<div class="icon blue" />
			Blue Square
		</li>
		<li class="list-item" draggable="true" data-value="red" on:dragstart={handleDragDrop}>
			<div class="icon red" />
			Red Square
		</li>
	</ul>
</div>