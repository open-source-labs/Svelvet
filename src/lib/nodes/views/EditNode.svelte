<script>
  import { findStore } from '$lib/store/controllers/storeApi';
  import { getNodeById } from '$lib/store/controllers/storeApi';

  export let nodeId;
  export let canvasId;
  export let isEditing;

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
    if (label) currentNode.data.label = label;
    if (width) currentNode.width = width;
    if (height) currentNode.height = height;
    if (backgroundColor) currentNode.bgColor = backgroundColor;
    width = '';
    height = '';
    customClass = '';
    label = '';

    store.nodesStore.set($nodesStore);
  };
</script>

{#if isEditing}
  <div
    class="EditNode"
    style="left:{currentNode.positionX +
      currentNode.width}px; top:{currentNode.positionY}px"
  >
    <form on:submit={editNode}>
      <label for="label-input">Label</label>
      <input
        type="text"
        id="label-input-{nodeId}"
        placeholder={currentNode.data.label}
        bind:value={label}
      />

      <label for="bg-color-input">Background Color</label>
      <input
        type="color"
        id="bg-color-input-{nodeId}"
        class="bgci"
        bind:value={backgroundColor}
      />
      <input
        type="text"
        placeholder={currentNode.bgColor}
        bind:value={backgroundColor}
      />
    </form>
    <div class="btn-container">
      <button
        on:click={(e) => {
          console.log('on delete button clicked');
          const store = findStore(canvasId);
          const node = getNodeById(store, nodeId);
          node.delete();
          isEditing = false;
        }}>Delete Node</button
      >
      <button
        on:click={(e) => {
          editNode(e);
          isEditing = false;
        }}>Submit</button
      >
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
{/if}

<style>
  .EditNode {
    position: absolute;
    padding: 0 1rem 1rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #333333;
    border-radius: 0.25rem;
    background-color: #ffffff;
    z-index: 10;
    user-select: text;
    box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.4);
    color: #333333;
  }

  label {
    font-size: 0.8rem;
    font-weight: bold;
    margin-bottom: 0.15rem;
  }

  .btn-container {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
  }

  button {
    border-radius: 0.25rem;
    background-color: white;
    box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.4);
    margin: 0.2rem;
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
