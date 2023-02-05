<script lang="ts">
  import { findStore } from '../../store/controllers/storeApi';
  import { getEdgeById } from '../../store/controllers/storeApi';

  export let edgeId: string;
  export let canvasId: string;
  export let isEditing: boolean;

  let label;
  let width;
  let height;
  let customClass;
  let backgroundColor;

  const store = findStore(canvasId);

  const { edgesStore } = store;

  let currentEdge = $edgesStore[edgeId];

  function closeModal() {
    const store = findStore(canvasId);
    store.edgeEditModal.set(null);
  }
  function handleDelete() {
    const store = findStore(canvasId);
    const edge = getEdgeById(store, edgeId);
    edge.delete();
    closeModal();
  }
</script>

{#if isEditing}
  <div
    class="EditEdge"
    style="left:{currentEdge.sourceX}px; top:{currentEdge.sourceY}px"
  >
    <div class="btn-container">
      <button on:click={handleDelete}>Delete Edge</button>
      <button on:click={closeModal}>Cancel</button>
    </div>
  </div>
{/if}

<style>
  .EditEdge {
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

  button:hover {
    cursor: pointer;
    background-color: #e45b56;
    color: white;
  }
</style>
