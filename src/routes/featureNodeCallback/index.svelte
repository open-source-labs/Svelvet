<script>
  import Svelvet from '$lib/container/views/Svelvet.svelte';

  const initialNodes = [
    {
      id: 1,
      position: { x: 225, y: 10 },
      data: { label: 'Click me!' },
      width: 100,
      height: 100,
      bgColor: 'white',
      borderColor: 'transparent',
      clickCallback: (node) => {
        alert('you clicked node 1!');
      },
    },
    {
      id: 2,
      position: { x: 390, y: 180 },
      data: { label: 'Click the edge!' },
      width: 125,
      height: 40,
      bgColor: 'white',
      textColor: 'black',
      targetPosition: 'left',
      clickCallback: (edge) => {
        alert('you clicked node 2!');
      },
    },
  ];

  const initialEdges = [
    {
      id: 'e1-2',
      source: 1,
      target: 2,
      label: 'edge label',
      clickCallback: (edge) => {
        alert('you clicked an edge!');
      },
    },
  ];
</script>

<Svelvet
  nodes={initialNodes}
  edges={initialEdges}
  width={900}
  height={900}
  background
/>

<Svelvet
  nodes={initialNodes}
  edges={initialEdges}
  width={900}
  height={900}
  background
/>

<!-- <Canvas nodes={initialNodes} edges={initialEdges} /> -->
