<script>
  import { findStore } from "$lib/controllers/storeApi";

  export let nodeId;
  export let canvasId;


  let label;
  let width;
  let height;
  let customClass;
  let backgroundColor;

  const store = findStore(canvasId);

  const { nodesStore } = store;

  let currentNode = $nodesStore[nodeId];

  const editNode = (e) => {
    e.preventDefault();
    if (label) currentNode.data = JSON.stringify(label);
    if (width) currentNode.width = Number(width);
    if (height) currentNode.height = Number(height);
    if (backgroundColor) currentNode.bgColor = backgroundColor;
    width = '';
    height = '';
    customClass = '';
    label = '';
    
    store.nodesStore.set($nodesStore);
  }

</script>

<div class='EditNode'
style='left:{currentNode.positionX + currentNode.width}px; top:{currentNode.positionY}px' >
  <form on:submit={editNode}>
    <label for="label-input">Label</label>
    <input type="text" id="label-input-{nodeId}" placeholder="{currentNode.data}" bind:value={label}>
    <label for="width-input">Width</label>
    <input type="text" id="width-input-{nodeId}" placeholder="{currentNode.width.toString()}" bind:value={width}>
    <label for="height-input">Height</label>
    <input type="text" id="height-input-{nodeId}" placeholder="{currentNode.height.toString()}" bind:value={height}>
    <label for="bg-color-input">Background Color</label>
    <input type="color" id="bg-color-input-{nodeId}" class="bgci"  bind:value={backgroundColor}>
    <input type="text" placeholder="{currentNode.bgColor}" bind:value={backgroundColor}>
  </form>
  <div class="btn-container">
    <button on:click={(e) => {
    }}>Delete Node</button>
    <button on:click={editNode}>Submit</button>
  </div>

  <!-- <p>canvasId: {canvasId}</p>
  <p>nodeId: {$nodesStore[nodeId].id}</p>
  <p>data: {$nodesStore[nodeId].data}</p>
  <p>positionX: {$nodesStore[nodeId].positionX}</p>
  <p>positionY: {$nodesStore[nodeId].positionY}</p>
  <p>width: {$nodesStore[nodeId].width}</p>
  <p>height: {$nodesStore[nodeId].height}</p>
  <p>background-color: {$nodesStore[nodeId].bgColor}</p>
  <p>border-color: {$nodesStore[nodeId].borderColor}</p>
  <p>border-radius: {$nodesStore[nodeId].borderRadius}</p>
  <p>text-color: {$nodesStore[nodeId].textColor}</p> -->

</div>


<style>

.EditNode {
    position: absolute;
    padding: 0 1rem 1rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #333333;
    border-radius: 0.25rem;
    background-color: #FFFFFF;
    z-index: 10;
    user-select: text;
    box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.4);
    color: #333333;
}

label {
  font-size: .8rem;
  font-weight: bold;
  margin-bottom: .15rem;
}

.btn-container {
    display: flex;
    justify-content: space-between;
    margin-top: .5rem;
  }

button {
  border-radius: .25rem;
  background-color: white;
  box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.4);
  margin: .2rem;
}

input {
  height: 1.6rem;
  border-color: #e45b56;
}

.bgci {
  height: 2rem;
  width: 5rem;
  padding: 0;
  border: none;
  background-color: none;
}

button:hover {
  cursor: pointer;
  background-color: #e45b56;
  color: white;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>