<script>
  import Svelvet from '$lib/container/views/Svelvet.svelte';
  const initialNodes = [
    {
      id: 2,
      position: { x: 390, y: 150 },
      data: { label: 'Mixed Anchors' },
      width: 125,
      height: 40,
      bgColor: 'white',
      targetPosition: 'right',
      sourcePosition: 'left',
      /* insert className: '<yourCustomClass>' to see how you can apply custom node styling to existing nodes' */
    },
    {
      id: 3,
      position: { x: 225, y: 260 },
      data: { label: 'Output Node' },
      width: 100,
      height: 40,
      bgColor: '#FFE4E6',
    },
    {
      id: 4,
      position: { x: 25, y: 180 },
      data: { label: 'Drag me!' },
      width: 125,
      height: 40,
      bgColor: 'white',
      targetPosition: 'right',
    },
    {
      id: 5,
      position: { x: 390, y: 380 },
      data: { label: 'Custom Node' },
      width: 125,
      height: 40,
      bgColor: '#C8FFC7',
      borderColor: 'transparent',
      borderRadius: 0,
    },
    {
      id: 6,
      position: { x: 47.5, y: 360 },
      data: { label: 'I am NOT green' },
      width: 80,
      height: 80,
      borderColor: '#FF4121',
      borderRadius: 30,
      bgColor: 'white',
      textColor: '#FF4121',
    },
    {
      id: 1,
      position: { x: 175, y: 25 },
      data: { label: 'This is a custom class' },
      className: 'customClass',
      targetPosition: 'right',
      sourcePosition: 'left',
    },
  ];

  const initialEdges = [
    {
      id: 'e2-3',
      source: 2,
      target: 3,
      animate: true,
      label: 'animated edges',
    },
    {
      id: 'e1-4',
      source: 1,
      target: 4,
      type: 'step',
      animate: true,
      edgeColor: '#FF4121',
    },
    {
      id: 'e2-5',
      source: 2,
      target: 5,
      label: 'colored edges',
      animate: true,
      arrow: true,
      edgeColor: '#FF4121',
      labelBgColor: '#1F2937',
      labelTextColor: '#FFE4E6',
    },
    { id: 'e4-6', source: 4, target: 6, type: 'straight' },
    {
      id: 'e3-6',
      source: 3,
      target: 6,
      type: 'smoothstep',
      label: 'colored label',
      labelBgColor: '#FF4561',
      labelTextColor: 'white',
      animate: true,
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
  :global(.customClass) {
    width: 300px !important;
    height: 300px !important;
    background-color: #e07589 !important;
    box-shadow: 0px -50px 0px 0px #c1f9ff, 0px 50px 0px 0px #ff4121 !important;
  }
</style>
