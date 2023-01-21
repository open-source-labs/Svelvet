<script lang='ts'>
  // Declaring variables for Svelvet components which will be usable in other files
  import { Edge, Anchor, Node, createStore } from '$lib/stores/storeSchema'
  import { onMount } from 'svelte';
  import NodeComponent from '$lib/Containers/DevTools/Node.svelte'
  import AnchorComponent from '$lib/Containers/DevTools/Anchor.svelte'
  import EdgeComponent from '$lib/Containers/DevTools/Edge.svelte'

  export let nodes;
  export let edges;
  // console.log('This should be the array as initialNodes: ', nodes);
  // console.log('This should be the array as initialEdges: ', edges);

  const testingStore = createStore();
  const { nodesStore, edgesStore, anchorsStore } = testingStore;

  onMount(() => {
        const arrNodes = nodes.map(node => {
            return {
                userLabel: node.id, // we will be generating the node_id separately to ensure uniqueness
                width: node.width,
                height: node.height,
                bgColor: node.bgColor,
                data: JSON.stringify(node.data),
                positionX: node.position.x,
                positionY: node.position.y
            }
        });
        
        const arrEdges = edges.map(edge => {
          return edge;
        });
        

        const objNodes = {};
       // this creates the object that will eventually populate nodesStore and anchorsStore
        const mapLabelToId : object = {}
        arrNodes.forEach((parsedNode: object) => {
          const node_id = (Math.random() + 1).toString(36).substring(7);
          const { userLabel, width, height, bgColor, data, positionX, positionY } = parsedNode;
          objNodes[node_id] = new Node(node_id, userLabel, positionX, positionY, width, height, bgColor, data);
          mapLabelToId[userLabel] = node_id
          // resultArr.push(new Node(id, positionX, positionY, width, height, bgColor, data));
        })
        // populates nodeStore
        testingStore.nodesStore.set(objNodes);

        // create AnchorsStore
        const objAnchors = {};
        const arr2 = [];        
        arrEdges.forEach((parsedEdge: object )  => {
          // source, target is the userLabel for the node
          // we need to use source and target to look up the node in nodesStore and find the node_id 
          const {source, target, type} = parsedEdge;
          // create two anchors for each edge
          const anchorIds = {}
          const arr = [source,target]; // source, target are userLabels 
          const arr3 = []
          for (let i=0; i < arr.length; i++) {
            const anchor_id = (Math.random() + 1).toString(36).substring(7);
            const userLabel = arr[i];
            anchorIds[arr[i]] = anchor_id
            const anchor_cb = () => {
              const positionX = $nodesStore[mapLabelToId[userLabel]].positionX;
              const positionY = $nodesStore[mapLabelToId[userLabel]].positionY;
              $anchorsStore[anchor_id].positionX = positionX;
              $anchorsStore[anchor_id].positionY = positionY;
            }
            objAnchors[anchor_id] = new Anchor(anchor_id, mapLabelToId[userLabel], 'random_edge_id', 'source', -1, -1, anchor_cb)      
            arr3.push(objAnchors[anchor_id])
          }
          arr2.push(arr3)
        })

        //populates the anchorsStore
        testingStore.anchorsStore.set(objAnchors);
        //invoke callback to set each anchor's position based on the nodes
        Object.values($anchorsStore).forEach((el) => {
          el.callback();
        })
        
        const objEdges = {}; 
        console.log('arr2', arr2); // arr2 = [ [sourceAnchor, targetAnchor]  , [sourceAnchor, targetAnchor], ...            ]
        arrEdges.forEach((parsedEdge: object, idx: number )  => {
          // 		{ id: 'e1-2', source: 1, type: 'straight', target: 2, label: 'e1-2' },
          const {source, target, type} = parsedEdge;
          const arr4 = arr2[idx];
          const sourceAnchor = arr4[0];
          const targetAnchor  = arr4[1];
          console.log('.',arr2)
          console.log('!',sourceAnchor)
          console.log('!!',targetAnchor)
          // create edge
          const edge_id = (Math.random() + 1).toString(36).substring(7);
          objEdges[edge_id] = new Edge(edge_id, source, target, type, sourceAnchor.positionX, sourceAnchor.positionY, targetAnchor.positionX, targetAnchor.positionY,sourceAnchor.id, targetAnchor.id);
        });
        testingStore.edgesStore.set(objEdges);

      // nodes = resultArr;
      const tmp = $nodesStore;
      const node_ids = Object.keys(tmp)

      const testingNode = tmp[node_ids[0]];
      testingNode.handleDelete();
      


  })
</script>

<div>
  {#each Object.keys($nodesStore) as node_id}
    <NodeComponent {node_id}/>
  {/each}

  {#each Object.keys($anchorsStore) as anchor_id}
    <AnchorComponent {anchor_id} />
  {/each}

  {#each Object.keys($edgesStore) as edge_id}
    <EdgeComponent {edge_id} />
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