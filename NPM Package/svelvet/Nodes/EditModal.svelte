<!-- //////////// -- Scripts -- //////////// -->
<script>
  import { findOrCreateStore } from '../stores/store';
  export let key;
  let label;
  let width;
  let height;
  let customClass;
  let backgroundColor;

  let currentNode;

  const {
      nodesStore,
      nodeIdSelected,
      deleteNode
    } = findOrCreateStore(key);
  $: store = findOrCreateStore(key);
  $: currentNode = $nodesStore.filter(n => n.id === $nodeIdSelected)[0];

  const editNode = (e) => {
    e.preventDefault();
    const currentNode = $nodesStore.filter(n => n.id === $nodeIdSelected)[0];
    if (label) currentNode.data.label = label;
    if (width) currentNode.width = +width;
    if (height) currentNode.height = +height;
    if (customClass) currentNode.className = customClass;
    if (backgroundColor) currentNode.bgColor = backgroundColor;
    width = '';
    height = '';
    customClass = '';
    label = '';
    
    store.nodesStore.set($nodesStore);
    document.querySelector(`.edit-modal-${key}`).style.display = 'none';
  }

  const changeLabel = (e) => {
    const currentNode = $nodesStore.filter(n => n.id === $nodeIdSelected)[0];
    currentNode.data.label = e.target.value;
    store.nodesStore.set($nodesStore);
  }

</script>
<!-- /////////////////////////////////////// -->


<!-- //////////// -- Markup -- //////////// -->

<div class="edit-modal edit-modal-{key}">
  <h4>Edit Attributes</h4>
  {#if currentNode}
  <form on:submit={editNode}>
    <label for="label-input">Label</label>
    <input type="text" id="label-input-{key}" placeholder="{currentNode.data.label ? currentNode.data.label : 'None'}" bind:value={label} on:input={changeLabel}>
    <label for="width-input">Width</label>
    <input type="number" id="width-input-{key}" placeholder="{currentNode.width}" bind:value={width}>
    <label for="height-input">Height</label>
    <input type="number" id="height-input-{key}" placeholder="{currentNode.height}" bind:value={height}>
    <label for="bg-color-input">Background Color</label>
    <input type="color" id="bg-color-input-{key}" class="bgci"  bind:value={backgroundColor}>
    <input type="text" placeholder="{currentNode.bgColor}" bind:value={backgroundColor}>
    <label for="custom-class-input">Custom Class</label>
    <input type="text" id="custom-class-input-{key}" placeholder="{currentNode.className ? currentNode.className : 'None'}" bind:value={customClass}>
  </form>
  {/if}
  <div class="btn-container-{key} btn-container">
    <button on:click={(e) => {
      deleteNode(e, $nodeIdSelected);
      document.querySelector(`.edit-modal-${key}`).style.display = 'none';
    }
      }>Delete Node</button>
    <button on:click={editNode}>Submit</button>
  </div>
</div>
<!-- /////////////////////////////////////// -->


<!-- //////////// -- Styles -- //////////// -->
<style>
  .btn-container {
    display: flex;
    justify-content: space-between;
    margin-top: .5rem;
  }
  label {
    font-size: .8rem;
    font-weight: bold;
    margin-bottom: .15rem;
  }

  button {
    border-radius: .5rem;
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
  .edit-modal {
    position: absolute;
    padding: 0 1rem 1rem 1rem;
    display: none;
    flex-direction: column;
    align-items: center;
    border: 1px solid #333333;
    border-radius: 2rem;
    background-color: #FFFFFF;
    z-index: 10;
    user-select: text;
    box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.4);
    color: #333333;
  }

</style>
<!-- /////////////////////////////////////// -->