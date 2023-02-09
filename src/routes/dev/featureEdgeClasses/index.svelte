<script>
  // import Svelvet from 'svelvet-lime';
  import Svelvet from '$lib/container/views/Svelvet.svelte';
  const initialNodes = [
    {
      id: 2,
      position: { x: 390, y: 150 },
      data: { label: 'Mixed Anchors' },
      width: 125,
      height: 40,
      bgColor: 'white',
    },
    {
      id: 1,
      position: { x: 175, y: 25 },
      data: { label: 'This is a custom class' },
      className: 'customClassNode',
    },
  ];

  const initialEdges = [
    {
      id: 'e1-2',
      source: 1,
      target: 2,
      type: 'bezier',
      animate: true,
      edgeColor: '#FF4121',
      className: 'customClassEdge',
    },
  ];
</script>

<Svelvet
  nodes={initialNodes}
  edges={initialEdges}
  width={600}
  background
  initialZoom={2}
  initialLocation={{ x: 400, y: 380 }}
/>

<style>
  :global(.customClassNode) {
    width: 100px !important;
    height: 50px !important;
    background-color: #e07589 !important;
    box-shadow: 0px -50px 0px 0px #c1f9ff, 0px 50px 0px 0px #ff4121 !important;
  }

  :global(.customClassEdge) {
    stroke: #62c557; /* Background color against your svg */
    stroke-width: 20px;
  }
</style>
