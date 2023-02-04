<script lang='ts'>
  import Svelvet from '$lib/container/views/Svelvet.svelte';

  let initialNodes: any[] = [
    {
      id: '1',
      position: {x: 50, y: 50},
      data: {label: 'id-1'},
      width: 100,
      height: 50,
      bgColor: 'white',
      sourcePosition: 'bottom'
    },
    {
      id: '2',
      position: {x: 150, y: 200},
      data: {label: 'id-2'},
      width: 100,
      height: 50,
      bgColor: 'white',
      targetPosition: 'top'
    },
    {
      id: '3',
      position: {x: 20, y: 20},
      data: {label: 'id-3'},
      width: 100,
      height: 50,
      bgColor: 'white',
      sourcePosition: 'right'
    },
    {
      id: '4',
      position: {x: 100, y: 200},
      data: {label: 'id-4'},
      width: 100,
      height: 50,
      bgColor: 'white',
      targetPosition: 'left'
    },
  ]
  
 let initialEdges: any[] = [
    {
    id: 'bottom_top',
    source: '1',
    target: '2',
    label: 'this is the test edge',
    },
    {
      id: 'right_left',
      source: '3',
      target: '4',
      label: 'this is the test edge',
    },
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
  canvasId="4tsdgss32"
  nodes={initialNodes}
  edges={initialEdges}
  width={900}
  height={900}
  background
  shareable={true}
/>

<button on:click={addNodeAndEdge}>Click to add new node and new edge</button>

<style>
  button {
    border: 1px solid black;
  }
</style>





