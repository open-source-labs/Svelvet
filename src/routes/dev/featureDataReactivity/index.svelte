<script lang="ts">
  import Svelvet from '$lib/container/views/Svelvet.svelte';
  // import Svelvet from 'svelvetrabbits';
  let initialNodes = [
    {
      id: 1,
      position: { x: 50, y: 300 },
      data: { label: 'borderColor' },
      targetPosition: 'right',
      sourcePosition: 'left',
      width: 80,
      height: 40,
      borderColor: 'red',
      bgColor: 'white',
    },
    {
      id: 2,
      position: { x: 50, y: 150 },
      data: { label: 'textColor' },
      width: 80,
      height: 40,
      textColor: '#3F6FD6',
      bgColor: 'white',
    },
    {
      id: 3,
      position: { x: 250, y: 150 },
      data: { label: 'asdf' },
      width: 75,
      height: 50,
      textColor: 'white',
      borderColor: 'transparent',
      bgColor: 'black',
      alt: 'a carrot',
    },
    {
      id: 4,
      position: { x: 250, y: 500 },
      data: { label: 'Apple' },
      width: 100,
      height: 50,
      bgColor: 'red',
      borderRadius: 30,
    },
    {
      id: 5,
      position: { x: 450, y: 400 },
      data: { label: 'borderRadius' },
      width: 100,
      height: 50,
      bgColor: 'orange',
      borderRadius: 30,
    },
    {
      id: 7,
      position: { x: -500, y: -500 },
      data: { label: '123' },
      width: 100,
      height: 100,
      bgColor: 'orange',
      borderRadius: 30,
    },
    {
      id: 6,
      position: { x: -450, y: 400 },
      data: { label: 'I am far' },
      width: 100,
      height: 50,
      bgColor: 'green',
      borderRadius: 30,
    },
  ];
  let initialEdges = [
    { id: 'e3-4', source: 3, target: 4, animate: true, type: 'step' },
    { id: 'e1-6', source: 1, target: 6, animate: false },
    { id: 'e6-7', source: 6, target: 7, animate: false, type: 'step' },
  ];
  let newId = 9999;

  const addNodeAndEdge = () => {
    const newNode = {
      id: ++newId,
      position: { x: 200, y: 250 },
      data: { label: newId.toString() },
      width: 50,
      height: 50,
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
  $: initialPosition = { x: 0, y: 0 };
</script>

<Svelvet
  canvasId="canvasId"
  nodes={initialNodes}
  edges={initialEdges}
  width={900}
  height={900}
  initialZoom={zoom}
  background
  initialLocation={initialPosition}
  minimap={true}
/>

<button on:click={addNodeAndEdge}>add new node and edge</button>
<button
  on:click={() => {
    zoom += 0.1;
  }}>increase zoom</button
>
<button
  on:click={() => {
    zoom -= 0.1;
  }}>decrease zoom</button
>
<button
  on:click={() => {
    initialPosition.x += 50;
    initialPosition = initialPosition;
  }}>x position</button
>
<button
  on:click={() => {
    initialPosition.y += 50;
    initialPosition = initialPosition;
  }}>increase y position</button
>

<style>
  button {
    border: 1px solid black;
  }
</style>
