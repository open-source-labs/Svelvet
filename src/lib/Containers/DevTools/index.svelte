<script lang='ts'>
  // Declaring variables for Svelvet components which will be usable in other files
  import { Edge, Anchor, Node, createStore } from '$lib/stores/storeSchema'
  import { onMount } from 'svelte';
  import NodeComponent from '$lib/Containers/DevTools/Node.svelte'
  import AnchorComponent from '$lib/Containers/DevTools/Anchor.svelte'

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
        const objAnchors = {};
       // this creates the object that will eventually populate nodesStore and anchorsStore
        arrNodes.forEach(parsedNode => {
          const node_id = (Math.random() + 1).toString(36).substring(7);
          const { user_supplied_id, width, height, bgColor, data, positionX, positionY } = parsedNode;
          objNodes[node_id] = new Node(node_id, positionX, positionY, width, height, bgColor, data);

          const anchor_id = (Math.random() + 1).toString(36).substring(7);

          const anchor_cb = () => {
            const positionX = $nodesStore[node_id].positionX;
            const positionY = $nodesStore[node_id].positionY;
            $anchorsStore[anchor_id].positionX = positionX;
            $anchorsStore[anchor_id].positionY = positionY;
          }
          
          objAnchors[anchor_id] = new Anchor(anchor_id, node_id, 'random_edge_id', 'source', -1, -1, anchor_cb)
          // resultArr.push(new Node(id, positionX, positionY, width, height, bgColor, data));
        })
      
      // populates the nodesStore
      testingStore.nodesStore.set(objNodes);
      testingStore.anchorsStore.set(objAnchors);

      // nodes = resultArr;
      const tmp = $nodesStore;
      const node_ids = Object.keys(tmp)

      const testingNode = tmp[node_ids[0]];
      testingNode.handleDelete();
      
      Object.values($anchorsStore)[0].callback();
      console.log('do we have the right anchorsStore? ', Object.values($anchorsStore)[0]);
      

  })
</script>

<div>


  {#each Object.keys($nodesStore) as node_id}
    <NodeComponent {node_id}/>

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

  {#each Object.keys($anchorsStore) as anchor_id}
    <AnchorComponent {anchor_id} />
  {/each}
</div>


<style>
  /* .Node {
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
  } */
</style>