<script lang='ts'>
  import { findStore } from "$lib/controllers/storeApi";

  export let id: string;

  const store = findStore(id);

  const { nodesStore } = store;


</script>

<h1>This is the StoreView component that displays the store for specific Svelvet component</h1>

<h1>Svelvet Store Ids: {id}</h1>
{#each Object.keys($nodesStore) as storeId}
  <table>
    <tr>
      <th>canvasId</th>
      <th>id</th>
      <th>label</th>
      <th>positionX</th>
      <th>positionY</th>
      <th>width</th>
      <th>height</th>
      <th>background-color</th>
      <th>border-color</th>
      <th>border-radius</th>
      <th>text-color</th>
    </tr>
    <tr>
      <td>{id}</td>
      <td>{$nodesStore[storeId].id}</td>
      <td>{$nodesStore[storeId].data}</td>
      <td>{$nodesStore[storeId].positionX}</td>
      <td>{$nodesStore[storeId].positionY}</td>
      <td>{$nodesStore[storeId].width}</td>
      <td>{$nodesStore[storeId].height}</td>
      <td>{$nodesStore[storeId].bgColor}</td>
      <td>{$nodesStore[storeId].borderColor}</td>
      <td>{$nodesStore[storeId].borderRadius}</td>
      <td>{$nodesStore[storeId].textColor}</td>
    </tr>
  </table>
{/each}

<style>
  table {
    padding: 10px;
    text-align: center;
    margin: 10px;
  }

  th {
    padding: 10px;
    border: 1px solid black;
  }

  td {
    padding: 10px;
    border: 1px solid black;
  }
</style>