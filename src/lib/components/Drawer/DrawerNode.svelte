<script context='module' lang='ts'>
  import { writable } from 'svelte/store';
  import type { NodeConfig, CSSColorString} from '$lib/types'; 
  import { addProps } from '$lib/utils';

  // External stores
  export const defaultNodeProps = writable<Array<NodeConfig>>([]);

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

  // Creates props and adds to store
  export const createProps = () => {
    // Object that stores properties for the created node
    const nodeProps: any = {};
    // Array of property names and values for node
    const nodePropNames: any[] = ['bgColor', 'borderColor','label', 'width', 'height', 'locked', 'center', 'inputs', 'outputs', 'rotation', 'zIndex', 'TD', 'LR', 'useDefaults'];
    const nodePropsArray: any[] = [bgColor, borderColor, label, width, height, locked, center, inputs, outputs, rotation, zIndex, TD, LR, useDefaults];
    
    // Add props to node if they exist 
    addProps(nodePropNames, nodePropsArray, nodeProps);

    // If props were created add nodeProps object to store
    if (Object.keys(nodeProps).length) {
      defaultNodeProps.update(nodes => [...nodes, nodeProps])
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
  <h2>Nodes </h2>
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
          <label for='useDefaults'>useDefaults: </label> 
          <input id='useDefaults' type="checkbox" bind:value={useDefaults} on:change={handleUseDefaultsButtonClick}>
      </li>
      <li class='list-item'>
          <label for='label'>Label : </label>
          <input id='label' type="text" bind:value={label}>
      </li>

      <li class='list-item'>
          <h4>Dimensions: </h4>
      </li>
      <li class="list-item">               
          <label for='width'>Width:</label>
              <input id='width' class='inputField' type='input' bind:value={width}>
          <label for='height'>Height:</label> 
              <input id='height' class='inputField' type='input' bind:value={height}>
      </li>
      <li class='list-item'>
          <h4>Default Anchors: </h4>
      </li>
      <li class="list-item">
          <label for="inputAnchor">Input Anchors: </label>
          <input id='inputAnchor' class='inputField' type="number" bind:value={inputs}>
          <label for="outputAnchor">Output Anchors: </label>
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
          <button class ='nodeResetBtn btn' on:click|stopPropagation={handleNodeResetButtonClick}>Reset</button>
      </li>
      <li class='list-item'>
          <h4>Additional Settings:</h4>
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
  </ul>
</div>