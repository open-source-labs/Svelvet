<!-- //////////// -- Scripts -- //////////// -->
<script>
  import { findOrCreateStore } from '../stores/store';
  export let node;
  export let key;
  let label = '';
  let width = '';
  let height = '';
  let customClass = '';

  const {
      nodesStore
    } = findOrCreateStore(key);
  $: store = findOrCreateStore(key);

  const submitChanges = (e) => {
    console.log('label', label);
    console.log('width', width);
    console.log('height', height);
    node.className = 'testClass';
    document.querySelector('.edit-node-modal').style.display = 'none';
    store.nodesStore.update(); // update the nodes in the store
  }
</script>
<!-- /////////////////////////////////////// -->


<!-- //////////// -- Markup -- //////////// -->
<div class='edit-node-modal' >
  <label for="label">Change Label</label>
  <input type="text" id="label" name="label" bind:value={label}>
  <label for="height">Height</label>
  <input type="text" name="height" bind:value={height}>
  <label for="width">Width</label>
  <input type="text" name="width" bind:value={width}>
  <label for="class">Class Name</label>
  <input type="text" id="customClass">
  <button id="submit-node-edit" on:click={(e) => submitChanges()}>Submit</button>
</div>
<!-- /////////////////////////////////////// -->


<!-- //////////// -- Styles -- //////////// -->
<style>
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
</style>
<!-- /////////////////////////////////////// -->