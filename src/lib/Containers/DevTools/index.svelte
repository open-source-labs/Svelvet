<script>
  // Declaring variables for Svelvet components which will be usable in other files
  import { Edge, Anchor, Node, createStore } from '$lib/stores/storeSchema'
    import { onMount } from 'svelte';

  export let nodes;
  export let edges;
  console.log('This should be the array as initialNodes: ', nodes);
  console.log('This should be the array as initialEdges: ', edges);

  const testingStore = createStore();
  const { nodesStore, edgesStore, anchorsStore } = testingStore;

  onMount(() => {
        const arrNodes = nodes.map(node => {
            return {
                id: node.id,
                width: node.width,
                height: node.height,
                bgColor: node.bgColor,
                data: JSON.stringify(node.data),
                positionX: node.position.x,
                positionY: node.position.y
            }
        })
      testingStore.nodesStore.set(arrNodes);
  })
</script>


<h1>Hello World!</h1>
<div>
    {JSON.stringify($nodesStore)}
</div>