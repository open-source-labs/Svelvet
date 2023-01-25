<script>
  import Svelvet from '$lib/views/RefactoredComponents/Svelvet.svelte';
  import { rightCb, leftCb, topCb, bottomCb } from '$lib/controllers/anchorCb';
  const initialNodes = [
    {
      id: 4,
      position: { x: 50, y: 50 },
      data: { label: 'Drag me!' },
      width: 125,
      height: 40,
      bgColor: 'white',
      textColor: 'black',
      targetPosition: 'right',
    },
    {
      id: 6,
      position: { x: 300, y: 180 },
      data: { label: 'Custom Ndddode' },
      width: 80,
      height: 300,
      borderColor: '#FF4121',
      borderRadius: 30,
      bgColor: 'grey',
      textColor: '#FF4121',
    },
  ];

  const initialEdges = [
    {
      id: 'e2-6',
      source: 4,
      targetAnchorCb: leftCb,
      target: 6,
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

<!-- <Canvas nodes={initialNodes} edges={initialEdges} /> -->
