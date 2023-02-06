<script>
  import Svelvet from '$lib/container/views/Svelvet.svelte';

  // Example data for how library is to be used
  let initialNodes = [
    {
      id: 11,
      type: 'input',
      position: { x: 100, y: 50 },
      data: { label: 'Input Node' },
      width: 175,
      height: 40,
      bgColor: 'white'
    },
    {
      id: 12,
      type: 'default',
      position: { x: 350, y: 250 },
      data: { label: 'Default Node' },
      width: 175,
      height: 40,
      bgColor: 'white'
    },
    {
      id: 13,
      type: 'output',
      position: { x: 40, y: 400 },
      data: { label: 'Another Output!' },
      width: 175,
      height: 40,
      bgColor: 'white'
    },
    {
      id: 14,
      type: 'output',
      position: { x: 400, y: 530 },
      data: { label: 'You found me!' },
      width: 175,
      height: 40,
      bgColor: '#D3FFC3',
      textColor: '#FF7C70'
    },
    {
      id: 15,
      type: 'output',
      position: { x: 50, y: 200 },
      data: { label: 'Output Node' },
      width: 175,
      height: 40,
      bgColor: 'white'
    }
  ];

  let initialEdges = [
    { id: 'e1-2', source: 11, target: 12 },
    { id: 'e2-3', source: 12, target: 13, animate: true },
    { id: 'e2-4', source: 12, target: 14, label: 'pan to see below!', animate: true },
    { id: 'e1-5', source: 11, target: 15 }
  ];


  const addNodeAndEdge = () => {
    console.log('addNodeAndEdge fired')
    const newNode = {
      id: 3,
      position: { x: 200, y: 250 },
      data: { label: 'id=3' },
      width: 50,
      height: 50,
      bgColor: 'white',
      textColor: 'black',
      targetPosition: 'left',
    };
    
    const newEdge ={
      id: 'e2-3', source: 2, target: 3, label: 'new edge'
    }
    initialNodes = [...initialNodes, newNode];
    // initialNodes = initialNodes;
    console.log('updated initial nodes => ', initialNodes)
    initialEdges = [...initialEdges, newEdge];
    // initialEdges = initialEdges;
    console.log('updated initial edges => ', initialEdges)
  }

</script>

<Svelvet
  nodes={initialNodes}
  edges={initialEdges}
  width={900}
  height={900}
  background
  movement={false}
/>

<button on:click={addNodeAndEdge}>Click to add new node and new edge</button>

<style>
  button {
    border: 1px solid black;
  }
</style>





