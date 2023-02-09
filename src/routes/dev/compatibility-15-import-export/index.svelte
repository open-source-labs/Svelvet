<script lang="ts">
  import Svelvet from 'svelvet-lime';
  // import Svelvet from '$lib/container/views/Svelvet.svelte';

  const initialNodes: any[] = [
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

  const initialEdges: any[] = [
    { id: 'e1-2', source: 1, target: 2, label: 'edge label' },
  ];
</script>

<Svelvet
  canvasId="canvas1"
  nodes={initialNodes}
  edges={initialEdges}
  width={900}
  height={900}
  background
  shareable={true}
  nodeCreate
/>

<Svelvet
  canvasId="canvas2"
  nodes={[]}
  edges={[]}
  width={900}
  height={900}
  background
  shareable={true}
  nodeCreate
/>
