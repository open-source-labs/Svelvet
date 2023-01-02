<!-- //////////// -- Scripts -- //////////// -->
<script>
  import { findOrCreateStore } from '../stores/store';
  // export let node;
  export let key;
  let label = '';
  let width = '';
  let height = '';
  let customClass = '';
  let currentNode;

  const {
      nodesStore,
      nodeIdSelected,
      getStyles
    } = findOrCreateStore(key);
  $: store = findOrCreateStore(key);
  $: currentNode = $nodesStore.filter(n => n.id === $nodeIdSelected)[0];

  // const currentNode = $nodesStore.filter(n => n.id === $nodeIdSelected)[0];

  const changeLabel = (e) => {
    e.preventDefault();
    const currentNode = $nodesStore.filter(n => n.id === $nodeIdSelected)[0];
    if (label) currentNode.data.label = label;
    if (width) currentNode.width = +width;
    if (height) currentNode.height = +height;
    if (customClass) currentNode.className = customClass;
    width = '';
    height = '';
    customClass = '';
    
    store.nodesStore.set($nodesStore);
    document.querySelector('.edit-modal').style.display = 'none';
    document.querySelector('#label-input').value = '';
  }
</script>
<!-- /////////////////////////////////////// -->


<!-- //////////// -- Markup -- //////////// -->

<!-- <div class='edit-node-modal' >
  <label for="label">Change Label</label>
  <input type="text" id="label" name="label" bind:value={label}>
  <label for="height">Height</label>
  <input type="text" name="height" bind:value={height}>
  <label for="width">Width</label>
  <input type="text" name="width" bind:value={width}>
  <label for="class">Class Name</label>
  <input type="text" id="customClassInput">
  <button id="submit-node-edit" on:click={(e) => submitChanges()}>Submit</button>
</div> -->

<div class="edit-modal">
  <h4>Edit Attributes</h4>
  {#if currentNode}
  <form on:submit={changeLabel}>
    <label for="label-input">Label</label>
    <input type="text" id="label-input" bind:value={label}>
    <label for="width-input">Width</label>
    <input type="text" id="width-input" bind:value={width}>
    <label for="height-input">Height</label>
    <input type="text" id="height-input" bind:value={height}>
    <label for="custom-class-input">Custom Class</label>
    <input type="text" id="custom-class-input" bind:value={customClass}>
  </form>
  {/if}
  <button on:click={changeLabel}>Submit</button>
</div>
<!-- /////////////////////////////////////// -->


<!-- //////////// -- Styles -- //////////// -->
<style>
  label {
    font-size: .8rem;
    font-weight: bold;
  }

  button {
    border-radius: .5rem;
    background-color: white;
    box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.4);
  }

  button:hover {
    cursor: pointer;
    background-color: #e45b56;
    color: white;
  }

  .edit-node-modal {
    position: absolute;
    left: -20px;
    top: -20px;
    width: 200px;
    height: 200px;
    background-color: antiquewhite;
    border-radius: 1rem;
    border: 1px solid black;
    display: none;
    flex-direction: column;
    /* opacity: 0; */
    z-index: 5;
  }

  .edit-modal {
    position: absolute;
    padding: 1rem;
    display: none;
    border: 1px solid white;
    border-radius: 3%;
    background-color: #e45b56;
    z-index: 10;
    user-select: text;
  }

  #label-input {
    z-index: 1000 !important;
  }
</style>
<!-- /////////////////////////////////////// -->