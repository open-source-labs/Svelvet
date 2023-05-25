<script context='module' lang='ts'>
  import { writable } from 'svelte/store';
  import type { CSSColorString} from '$lib/types'; 
  import { addProps } from '$lib/utils';
  import { Edge } from '$lib';

  // External Stores
  export const edgePropsStore = writable<Array<any>>([]);

  //types for edge creation
  let edgeWidth: number | undefined; 
  let targetColor: CSSColorString | undefined;
  let color: CSSColorString | undefined;
  let straight: boolean | undefined;
  let step: boolean | undefined;
  let cornerRadius: number | undefined;
  let animate: boolean | undefined;
  let edgeLabel: string | undefined;
  let labelColor: CSSColorString | undefined;
  let textColor: CSSColorString | undefined;
  let edgeClick: () => void | null; // Stretch feature

  // Creates props and adds to store, returns true if anchor was created
  export const createEdgeProps = () => {
      
    // Object that stores properties for the created edge
    const edgeProps: any = {};
    // Array of property names and values for edge
    const edgePropsNames: any[] = ['width', 'targetColor', 'color', 'straight', 'step', 'cornerRadius', 'animate', 'label', 'labelColor', 'textColor'];
    const edgePropsArray: any[] = [edgeWidth, targetColor, color, straight, step, cornerRadius, animate, edgeLabel, labelColor, textColor];
        
    // Add props to edge if they exist
    addProps(edgePropsNames, edgePropsArray, edgeProps);

    // If props were created add edgeProps object to store
    if (Object.keys(edgeProps).length) {
      edgePropsStore.update(edges =>{
        console.log(edges)
         return [...edges, [Edge, edgeProps]]})
    }
  }

  const handleStraightButtonClick = (e: any) => {
    straight = e.target.checked;
  }
  const handleStepButtonClick = (e: any) => {
    step = e.target.checked;
  }
  const handleAnimateButtonClick = (e: any) => {
    animate = e.target.checked;
  }

  const handleEdgeResetButtonClick = (e: any) => {
    edgeWidth = undefined;
    targetColor = undefined;
    color = undefined;
    straight = undefined;
    step = undefined;
    cornerRadius = undefined;
    animate = undefined;
    edgeLabel = undefined;
    labelColor = undefined;
    textColor = undefined;
    //edgeClick: () => void | null;
  }

</script>

<div id="edgeContainer">
  <h3>Edges:</h3>
  <ul>
      <li class='list-item'>
          <label for='targetColor'>Target Color : </label>
          <input id='targetColor' class='colorWheel' type='color' bind:value={targetColor}>
      </li>
      <li class='list-item'>
          <label for='color'>Color : </label>
          <input id='color' class='colorWheel' type='color' bind:value={color}>
      </li>
      <li class='list-item'>
          <label for='labelColor'>Label Color : </label>
          <input id='labelColor' class='colorWheel' type='color' bind:value={labelColor}>
      </li>
      <li class='list-item'>
          <label for='textColor'>Text Color : </label>
          <input id='textColor' class='colorWheel' type='color' bind:value={textColor}>
      </li>
      <li class='list-item'>
          <label for='width'>Width :</label> 
          <input id = 'width'  class='inputField' type="number"  bind:value={edgeWidth}>
      </li>
      <li class='list-item'>
          <label for='cornerRadius'>Corner Radius :</label> 
          <input id = 'cornerRadius'  class='inputField' type="number"  bind:value={cornerRadius}>
      </li>            
      <li class='list-item'>
          <label for='straight'>Straight : </label>
          <input id='straight' type="checkbox" bind:value={straight} on:change={handleStraightButtonClick}>
      </li>
      <li class='list-item'>
          <label for='step'>Step : </label>
          <input id='step' type="checkbox" bind:value={step} on:change={handleStepButtonClick}>
      </li>
      <li class='list-item'>
          <label for='animate'>Animate : </label>
          <input id='animate' type="checkbox" bind:value={animate} on:change={handleAnimateButtonClick}>
      </li>
     
      <li class='list-item'>
          <label for='edgeLabel'>Edge Label : </label>
          <input id='edgeLabel' type="text" bind:value={edgeLabel}>
      </li>
      <li class='list-item'>
          <button class ='edgeResetBtn btn' on:click|stopPropagation={handleEdgeResetButtonClick}>Reset</button>
      </li>
  </ul>
</div>