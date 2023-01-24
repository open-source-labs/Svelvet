<script>
  import Svelvet from '$lib/views/RefactoredComponents/Svelvet.svelte';
  import { rightCb, leftCb, topCb, bottomCb } from '$lib/controllers/anchorCb';
  const initialNodes = [
    {
      id: 4,
      position: { x: 25, y: 180 },
      data: { label: 'Drag me!' },
      width: 125,
      height: 40,
      bgColor: 'white',
      textColor: 'black',
      targetPosition: 'right',
    },
    {
      id: 6,
      position: { x: 47.5, y: 360 },
      data: { label: 'Custom Ndddode' },
      width: 80,
      height: 80,
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
      sourceAnchorCb: rightCb,
      targetAnchorCb: rightCb,
      target: 6,
      type: 'straight',
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
