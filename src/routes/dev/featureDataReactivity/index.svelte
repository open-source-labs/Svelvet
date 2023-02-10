<script lang="ts">
  import Svelvet from '$lib/container/views/Svelvet.svelte';
  // import Svelvet from 'svelvetrabbits';
  let initialNodes: any[] = [
    {
      id: 1,
      position: { x: 225, y: 10 },
      data: { label: 'id=1' },
      width: 100,
      height: 100,
      bgColor: 'white',
      borderColor: 'transparent',
      image: true,
      src: 'https://svelvet.io/_app/assets/Logo%201-cc7b0baf.svg',
    },
    {
      id: 2,
      position: { x: 390, y: 180 },
      data: { label: 'id=2' },
      width: 125,
      height: 40,
      bgColor: 'white',
      textColor: 'black',
      targetPosition: 'left',
    },
  ];

  let initialEdges: any[] = [
    { id: 'e1-2', source: 1, target: 2, label: 'edge label' },
  ];
  let newId = 3;

  const addNodeAndEdge = () => {
    const newNode = {
      id: ++newId,
      position: { x: 200, y: 250 },
      data: { label: newId.toString() },
      width: 50,
      height: 50,
      bgColor: 'white',
      textColor: 'black',
      targetPosition: 'left',
    };
    const newEdge = {
      id: `edge-${newId}`,
      source: 2,
      target: newId,
      label: 'new edge',
    };
    initialNodes = [...initialNodes, newNode];
    initialEdges = [...initialEdges, newEdge];
  };

  $: zoom = 1;
</script>

<Svelvet
  canvasId="canvasId"
  nodes={initialNodes}
  edges={initialEdges}
  width={900}
  height={900}
  initialZoom={zoom}
  background
  shareable={true}
  editable={true}
/>

<button on:click={addNodeAndEdge}>Click to add new node and new edge</button>
<button
  on:click={() => {
    zoom += 0.1;
  }}>Click to increase zoom</button
>
<button
  on:click={() => {
    zoom -= 0.1;
  }}>Click to decrease zoom</button
>

<button on:click={addNodeAndEdge}>Click to change position</button>

<style>
  button {
    border: 1px solid black;
  }
</style>
