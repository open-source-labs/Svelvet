<script context='module' lang='ts'>
  import { writable } from 'svelte/store';
  import type { NodeConfig, CSSColorString} from '$lib/types'; 
  import { addProps } from '$lib/utils';

  // External stores
  export const defaultNodePropsStore = writable<Array<NodeConfig>>([]);
  export const customNodePropsStore = writable<Array<NodeConfig>>([]);

  // types for node creation
  let bgColor: CSSColorString | undefined;
  let borderColor: CSSColorString | undefined;
  let label: string | undefined;
  let width: number = 200;
  let height: number = 100;
  let nodeDirection: string | undefined;
  let inputs: number | undefined;
  let outputs: number | undefined;
  let locked: boolean | undefined;
  let center: boolean | undefined;
  let rotation: number | undefined;
  let zIndex: number | undefined;
  let TD: boolean | undefined;
  let LR: boolean | undefined;
  let useDefaults: boolean | undefined;

  // Creates props and adds to customNodePropsStore if an anchor was created, defaultNodePropsStore if not
  export const createNodeProps = (anchorCreated: boolean) => {
    // Object that stores properties for the created node
    const nodeProps: any = {};
    // Array of property names and values for node
    const nodePropNames: any[] = ['bgColor', 'borderColor','label', 'width', 'height', 'locked', 'center', 'inputs', 'outputs', 'rotation', 'zIndex', 'TD', 'LR', 'useDefaults'];
    const nodePropsArray: any[] = [bgColor, borderColor, label, width, height, locked, center, inputs, outputs, rotation, zIndex, TD, LR, useDefaults];
    
    // Add props to node if they exist 
    addProps(nodePropNames, nodePropsArray, nodeProps);

    // If props were created add nodeProps object to store
    if (Object.keys(nodeProps).length) {
      if(!anchorCreated) defaultNodePropsStore.update(nodes => [...nodes, nodeProps])
      else customNodePropsStore.update(nodes => [...nodes, nodeProps]) 
    }
  }

  // Button clicks for defaultNodes
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
    TD = undefined;
    LR = undefined;
    useDefaults = undefined;
  }

  const handleLockedButtonClick = (e: any) => {
	locked = e.target.checked;
  }

  const handleCenterButtonClick = (e: any) => {
	center = e.target.checked;
  }

  const handleUseDefaultsButtonClick = (e: any) => {     
    useDefaults = e.target.checked;
          
  }

  const handleAnchorPositionButton = (e: any) => {
    if (e.target.value == '') nodeDirection = undefined;
      else {    
        console.log(e.target.value);   
        nodeDirection = e.target.value;
        if (nodeDirection === 'LR') {
            LR = true;
            TD = false;
        }
        else {
            TD = true;
            LR = false;
        }
      }
  }

</script>

<div id='nodeContainer'>
  <ul>
      <li class='list-item'>
          <label for='bgColor'>Background: </label>
          <input id='bgColor' class='colorWheel' type='color' bind:value={bgColor}>
      </li>
      <li class='list-item'>
          <label for='borderColor'>Border: </label>
          <input id='borderColor' class='colorWheel' type='color' bind:value={borderColor}>
      </li>
      <li class='list-item'>
          <label for='useDefaults'>useDefaults: </label> 
          <input id='useDefaults' type="checkbox" bind:value={useDefaults} on:change={handleUseDefaultsButtonClick}>
      </li>
      <li class='list-item'>
          <label for='label'>Label : </label>
          <input id='label' type="text" bind:value={label}>
      </li>

      <li class='list-item'>
        <label for='dimensions' style="fontWeight:'bold'">Dimensions:</label>
      </li>
      <li class="list-item">               
          <label for='width'>Width:</label>
              <input id='width' class='inputField' type='input' bind:value={width}>
          <label for='height' style="margin-left: 6px">Height:</label> 
              <input id='height' class='inputField' type='input' bind:value={height}>
      </li>
      <li class='list-item'>
        <label for='defaultAnchors'>Default Anchors:</label>
      </li>
      <li class="list-item">
          <label for="inputAnchor">Input: </label>
          <input id='inputAnchor' class='inputField' type="number" bind:value={inputs}>
          <label for="outputAnchor" style="margin-left: 6px">Output: </label>
          <input id='outputAnchor' class='inputField' type="number" bind:value={outputs}>
      </li>
      <li class="list-item">
        <label for='anchorPositon'>Anchor Position: </label>
        <select id='anchorPosition' bind:value={nodeDirection} on:change={handleAnchorPositionButton}>
            <option value=''>-</option>
            <option value='LR'>LR</option>
            <option value='TD'>TD</option>                        
        </select>					
        </li> 
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
        <li class='list-item'>
            <button class ='nodeResetBtn btn' on:click|stopPropagation={handleNodeResetButtonClick}>Reset</button>
        </li>    
    </ul>
</div>

<style>
  /* General Styling */
  #nodeContainer{
   
        width: 100%;
        font-size: 15px;
    }
 #nodeContainer ul{
 margin:0;
 padding:0;
 }

    label {
        margin-right: 10px;
    }

    .list-item{
        display: flex;
        flex-direction: row;
        align-items: center;
        list-style: none;
        margin-bottom: 10px;
        margin-right: 3px;
    }
    .colorWheel{
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: transparent;
        border: none;
        width: 35px;
        height: 35px;
        cursor: pointer;
        border-radius: 50%;
    }

    .colorWheel::-webkit-color-swatch{
        border-radius: 40%;
    }
    .colorWheel::-moz-color-swatch{
        border-radius: 40%;
    }

    .inputField {
        width: 50px;

    }

    .btn {
        width: 120px;
        color: aliceblue;
        padding: 8px 20px;
        margin: auto;
        margin-top: 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 15px;
        
    }
    .nodeResetBtn{
        color:  var(
			--prop-drawer-button-text-color,
			var(--drawer-button-text-color, var(--default-drawer-button-text-color))
		);;
        background-color: var(
			--prop-drawer-button-color,
			var(--drawer-button-color, var(--default-drawer-button-color))
		);
        box-shadow: 0 0 0 var(--final-border-width) var(--final-border-color),
			var(--default-node-shadow);
    }

    .nodeResetBtn:hover{
        color:  var(
			--prop-drawer-button--focus-text-color,
			var(--drawer-button-focus-text-color, var(--default-drawer-button-focus-text-color))
		);;
        background-color: var(
			--prop-drawer-button-focus-color,
			var(--prop-drawer-button-focus-color, var(--default-drawer-button-focus-color))
		);
    }
 
</style>