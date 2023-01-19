<script lang='ts'>
  // Declaring variables for Svelvet components which will be usable in other files
  import { Edge, Anchor, Node, createStore } from '$lib/stores/storeSchema'
  import { onMount } from 'svelte';
  import NodeComponent from '$lib/Containers/DevTools/Node.svelte'

  export let nodes;
  export let edges;
  // console.log('This should be the array as initialNodes: ', nodes);
  // console.log('This should be the array as initialEdges: ', edges);

  const testingStore = createStore();
  const { nodesStore, edgesStore, anchorsStore } = testingStore;

  onMount(() => {
        const arrNodes = nodes.map(node => {
            return {
                user_supplied_id: node.id, // we will be generating the node_id separately to ensure uniqueness
                width: node.width,
                height: node.height,
                bgColor: node.bgColor,
                data: JSON.stringify(node.data),
                positionX: node.position.x,
                positionY: node.position.y
            }
        })
        const objNodes = {};
        // const resultArr = []
        arrNodes.forEach(parsedNode => {
          const node_id = (Math.random() + 1).toString(36).substring(7);
          const { user_supplied_id, width, height, bgColor, data, positionX, positionY } = parsedNode;
          objNodes[node_id] = new Node(node_id, positionX, positionY, width, height, bgColor, data);
          // resultArr.push(new Node(id, positionX, positionY, width, height, bgColor, data));
        })
      testingStore.nodesStore.set(objNodes);
      // nodes = resultArr;
      const tmp = $nodesStore;
      const node_ids = Object.keys(tmp)

      const testingNode = tmp[node_ids[0]];
      testingNode.handleDelete();


      console.log($nodesStore)
  })
</script>

<div>
  <h1>Hello World!</h1>
  <p>
    {JSON.stringify($nodesStore)}
  </p>
  


  {#each Object.keys($nodesStore) as node_id}
    <NodeComponent {node_id}/>
    <div
    class="Node"
    style="left: {100}px;
      top: {200}px;
      width: {150}px;
      height: {75}px;
      background-color: blue;"
    ></div>

    
    <!-- <div
    class="Node"
    style="left: {node.positionX}px;
      top: {node.positionY + 100}px;
      width: {node.width}px;
      height: {node.height}px;
      background-color: {node.bgColor};
      border-color: {node.borderColor};
      border-radius: {node.borderRadius}px;
      color: {node.textColor};"
    id="svelvet-{node.id}"
    ></div> -->
  {/each}
</div>


<style>
  .Node {
    position: absolute;
    display: grid;
    user-select: none;
    cursor: move;
    justify-content: center;
    overscroll-behavior: auto;
    align-items: center;
    font-size: 14px;
    text-align: center;
    border: solid 1px black;
    border-radius: 5px;
    box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.2);
  }
</style>