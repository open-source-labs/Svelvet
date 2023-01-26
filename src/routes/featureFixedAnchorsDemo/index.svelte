<script>
  import Svelvet from '$lib/views/RefactoredComponents/Svelvet.svelte';
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
      id: 3,
      position: { x: 50, y: 300 },
      data: { label: 'Drag me!' },
      width: 125,
      height: 40,
      bgColor: 'white',
      textColor: 'black',
      targetPosition: 'right',
    },
    {
      id: 5,
      position: { x: 50, y: 450 },
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

  // see '$lib/controllers/anchorCb' for documentation
  export const topAnchor = (xNode, yNode, widthNode, heightNode) => {
    const xAnchor = xNode;
    const yAnchor = yNode + heightNode / 6;
    return [xAnchor, yAnchor, 180];
  };
  export const middleAnchor = (xNode, yNode, widthNode, heightNode) => {
    const xAnchor = xNode;
    const yAnchor = yNode + heightNode / 2;
    return [xAnchor, yAnchor, 180];
  };
  export const bottomAnchor = (xNode, yNode, widthNode, heightNode) => {
    const xAnchor = xNode;
    const yAnchor = yNode + (5 * heightNode) / 6;
    return [xAnchor, yAnchor, 180];
  };

  const initialEdges = [
    {
      id: 'e2-6',
      source: 4,
      targetAnchorCb: topAnchor,
      target: 6,
    },
    {
      id: '22132451',
      source: 3,
      targetAnchorCb: middleAnchor,
      target: 6,
    },
    {
      id: '56456s46fsd',
      source: 5,
      targetAnchorCb: bottomAnchor,
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
