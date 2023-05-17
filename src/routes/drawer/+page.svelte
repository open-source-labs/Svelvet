<script lang='ts'>
   import { Node, Svelvet, Anchor} from '$lib';
   import ThemeToggle from '$lib/components/ThemeToggle/ThemeToggle.svelte';
   import type { NodeConfig, CSSColorString, Direction} from '$lib/types';

   let nodes: NodeConfig[] = [];
   let anchors: any[] = [];
   let dropped_in :boolean;

   // types for node creation
   let bgColor: CSSColorString | undefined;
   let borderColor: CSSColorString | undefined;
   let label: string | undefined;
   let width: number = 200;
   let height: number = 100;
   let inputs: number | undefined;
   let outputs: number | undefined;
   let locked: boolean | undefined;
   let center: boolean | undefined;
   let rotation: number | undefined;
   let zIndex: number | undefined;

   // types for anchor creation
   let invisible: boolean | undefined;
   let nodeConnect: boolean | undefined;
   let input: boolean | undefined;
   let output: boolean | undefined;
   let multiple: boolean | undefined;
   let direction: Direction | undefined;
   let dynamic: boolean | undefined;
   let edgeLabel: string | undefined;
   let edgeColor: CSSColorString | undefined;
   let anchorLocked: boolean | undefined;
   let anchorBgColor: CSSColorString | undefined;

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
        const nodePropNames: any[] = ['bgColor', 'borderColor','label', 'width', 'height', 'locked', 'center', 'inputs', 'outputs', 'rotation', 'zIndex'];
        const nodePropsArray: any[] = [bgColor, borderColor, label, width, height, locked, center, inputs, outputs, rotation, zIndex];
       // Adds props to object if they exist
        const addProp = (names: any, vals : any, nodeProps : any): any => {
            for (let i = 0; i < names.length; i++) {
                if(vals[i]) nodeProps[names[i]] = vals[i];
            }
        }
        // Add props to node if they exist 
        addProp(nodePropNames, nodePropsArray, nodeProps);
        nodes = [...nodes, {...nodeProps}];

        // Object that stores properties for the created anchor
        const anchorProps: any = {};
        // Array of property names and values for anchor
        const anchorPropNames: any[] = ['invisible', 'nodeConnect', 'input', 'output', 'multiple', 'direction', 'dynamic', 'edgeLabel', 'edgeColor', 'locked', 'bgColor'];
        const anchorPropsArray: any[] = [invisible, nodeConnect, input, output, multiple, direction, dynamic, edgeLabel, edgeColor, anchorLocked, anchorBgColor];
        // Adds props to anchor if they exist
        addProp(anchorPropNames, anchorPropsArray, anchorProps);
        anchors = [...anchors, {...anchorProps}]
        console.log(anchors)
    }
    // Button clicks for Nodes
    const handleNodeResetButtonClick = (e: any) => {
		bgColor = undefined;
	 	borderColor = undefined;
        label = undefined;
		width = 200;
		height = 100;
        inputs = undefined;
        outputs = undefined;
        locked = undefined;
        center = undefined;
        rotation = undefined;
        zIndex = undefined;
	}

    const handleLockedButtonClick = (e: any) => {
		locked = e.target.checked;
	}

	const handleCenterButtonClick = (e: any) => {
		center = e.target.checked;
	}
    
    //Button Clicks for Anchors
    const handleAnchorLockedButtonClick = (e: any) => {
		anchorLocked = e.target.checked;
	}

	const handleInvisibleButtonClick = (e: any) => {
		invisible = e.target.checked;
	}

    const handleNodeConnectButtonClick = (e: any) => {
		nodeConnect = e.target.checked;
	}

    const handleInputButtonClick = (e: any) => {
		input = e.target.checked;
	}
    
    const handleOutputButtonClick = (e: any) => {
		output = e.target.checked;
	}

    const handleMultipleButtonClick = (e: any) => {
		multiple = e.target.checked;
	}

    const handleDynamicButtonClick = (e: any) => {
        dynamic = e.target.checked;
    }

    const handleDirectionButtonClick = (e: any) => {
        if (e.target.value == '') direction = undefined;
        else {
            direction = e.target.value;
        }
    }

    const handleAnchorResetButtonClick = (e: any) => {
        invisible = undefined;
        nodeConnect= undefined;
        input = undefined;
        output = undefined;
        multiple = undefined;
        direction = undefined;
        dynamic = undefined;
        edgeLabel = undefined;
        edgeColor = undefined;
        anchorLocked = undefined;
        anchorBgColor = undefined;
	}

</script>

<div	
	id = 'drop_zone'
	on:dragenter={handleDragEnter}
	on:dragleave={handleDragLeave}
	on:drop={handleDragDrop}   
    on:dragover = {onDragOver}
>
	<Svelvet height={600} zoom={0.75} minimap controls>
		{#each nodes as node}
			<Node {...node} drop="cursor">
                {#each anchors as anchor}
                    <Anchor {...anchor}></Anchor>
                {/each}
            </Node>			
		{/each}
        <ThemeToggle main=light alt=dark slot='toggle'/>
	</Svelvet>
</div>


<div id='drawerContainer'>
    <div id='nodeContainer'>
        <ul>
            <li class='list-item'>
                <label for='bgColor'>Background Color : </label>
                <input id='bgColor' class='colorWheel' type='color' bind:value={bgColor}>
            </li>
            <li class='list-item'>
                <label for='borderColor'>Border Color : </label>
                <input id='borderColor' class='colorWheel' type='color' bind:value={borderColor}>
            </li>
            <li class='list-item'>
                <label for='label'>Label : </label>
                <input id='label' type="text" bind:value={label}>
            </li>
            <li class="list-item">
                <h4>Dimensions: </h4>
                <label for='width'>Width:</label>
                    <input id='width' class='inputField' type='input' bind:value={width}>
                <label for='height'>Height:</label> 
                    <input id='height' class='inputField' type='input' bind:value={height}>
            </li>
            <li class="list-item">
                <h4>Default Anchors: </h4>
                <label for="inputAnchor">Input Anchors: </label>
                <input id='inputAnchor' class='inputField' type="number" bind:value={inputs}>
                <label for="outputAnchor">Output Anchors: </label>
                <input id='outputAnchor' class='inputField' type="number" bind:value={outputs}>
            </li>
            <li class='list-item'>
                <div class='nodes' draggable='true' on:dragstart={handleDragStart} on:dragend={handleDragEnd}> Node </div>
                <button class ='nodeResetBtn btn' on:click|stopPropagation={handleNodeResetButtonClick}>Reset</button>
            </li>
            <li>Additional Settings: </li>
            <li class='list-item'>
                <label for='locked'>Locked: </label> 
                <input id='label' type="checkbox" bind:value={locked} on:change={handleLockedButtonClick}>
            </li>
            <li class='list-item'>
                <label for='centered'>Centered: </label>
                <input id='centered' type="checkbox" bind:value={center} on:change={handleCenterButtonClick}>
            </li>
            <li class='list-item'>
                <label for='rotation'>Rotation:</label> 
                <input id = 'rotation'  class='inputField' type="number"  bind:value={rotation}>
            </li>
            <li class='list-item'>
                <label for='zIndex'>zIndex:</label> 
                <input id='zIndex'  class='inputField' type="number" bind:value={zIndex}>
            </li>
            
        </ul>
    </div>
    <div id='anchorContainer'>
        <ul>
            <li class='list-item'>
                <label for='anchorBgColor'>Background Color : </label>
                <input id='anchorBgColor' class='colorWheel' type='color' bind:value={anchorBgColor}>
            </li>
            <li class='list-item'>
                <label for='edgeColor'>Edge Color : </label>
                <input id='edgeColor' class='colorWheel' type='color' bind:value={edgeColor}>
            </li>
            <li class='list-item'>
                <label for='invisible'>Invisible : </label> 
                <input id='invisible' type="checkbox" bind:value={invisible} on:change={handleInvisibleButtonClick}>
            </li>
            <li class='list-item'>
                <label for='nodeConnect'>Node Connect: </label>
                <input id='nodeConnect' type="checkbox" bind:value={nodeConnect} on:change={handleNodeConnectButtonClick}>
            </li>
            <li class='list-item'>
                <label for='input'>Input : </label> 
                <input id='input' type="checkbox" bind:value={input} on:change={handleInputButtonClick}>
            </li>
            <li class='list-item'>
                <label for='output'>Output: </label>
                <input id='output' type="checkbox" bind:value={output} on:change={handleOutputButtonClick}>
            </li>
            <li class='list-item'>
                <label for='multiple'>Multiple: </label>
                <input id='multiple' type="checkbox" bind:value={multiple} on:change={handleMultipleButtonClick}>
            </li>
            <li class='list-item'>
                <label for='direction'>Direction: </label>
                <select id='direction' bind:value={direction} on:change={handleDirectionButtonClick}>
                    <option value =''>-</option>
                    <option value ='north'>North</option>
                    <option value ='south'>South</option>
                    <option value ='east'>East</option>
                    <option value ='west'>West</option>
                    <option value ='self'>Self</option>
                </select>                
            </li>
            <li class='list-item'>
                <label for='dynamic'>Dynamic: </label>
                <input id='dynamic' type="checkbox" bind:value={dynamic} on:change={handleDynamicButtonClick}>
            </li>
            <li class='list-item'>
                <label for='edgeLabel'>Edge Label : </label>
                <input id='edgeLabel' type="text" bind:value={edgeLabel}>
            </li>
            
            <li class='list-item'>
                <label for='anchorLocked'>Locked : </label>
                <input id='anchorLocked' type="checkbox" bind:value={anchorLocked} on:change={handleAnchorLockedButtonClick}>
            </li>
            <li class='list-item'>
                <button class ='anchorResetBtn btn' on:click|stopPropagation={handleAnchorResetButtonClick}>Reset</button>
            </li>
        </ul>
    </div>
</div>


<style>
    #drawerContainer{
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }

    label {
        margin-right: 10px;
    }

    /* nodeContainer Styling */
    .nodes{
        box-sizing: border-box;
       

        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
        width: 100px;
        border: 1px solid gray;
        cursor: pointer;
    }
    .list-item{
        display: flex;
        flex-direction: row;
        align-items: center;
        list-style: none;
        margin-bottom: 10px;
    }
    .colorWheel{
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: transparent;
        border: none;
        width: 40px;
        height: 40px;
        cursor: pointer;
        border-radius: 50%;
    }

    .colorWheel::-webkit-color-swatch{
        border-radius: 50%;
    }
    .colorWheel::-moz-color-swatch{
        border-radius: 50%;
    }

    .inputField {
        width: 50px;
        margin-left: 10px;
        margin-right: 10px;
    }

    .btn {
        width: 100px;
       
        color: aliceblue;
        padding: 5px;
        margin-left: 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .nodeResetBtn{
        background-color: rgb(109, 109, 246);
    }
    /* --------- */
    /* Anchor Styling  */

    .anchorResetBtn{   
        background-color: rgb(236, 107, 118);   
    }

</style>