<script>
  import Svelvet from '$lib/container/views/Svelvet.svelte';
  const initialNodes = [
    {
      id: 1,
      position: { x: 100, y: 20 },
      data: {
        html: ` <video width="480" height="360" src="https://i.imgur.com/zdT6tSz.mp4" controls autoplay loop></video>`,
      },
      width: 490,
      height: 370,
      bgColor: 'white',
    },
    {
      id: 2,
      position: { x: 0, y: 330 },
      data: { label: 'LEADER' },
      width: 70,
      height: 40,
      bgColor: 'white',
    },
    {
      id: 3,
      position: { x: 240, y: 510 },
      data: { html: `<button> Click Me! </button>` },
      width: 100,
      height: 50,
      bgColor: 'blue',
    },
    {
      id: 4,
      position: { x: 670, y: 330 },
      data: {
        html: `<label for="lname">Message Box:</label>
<input type="text" id="lname" name="lname" form="form1">`,
      },
      width: 200,
      height: 50,
      bgColor: 'white',
    },
    {
      id: 5,
      position: { x: 30, y: 510 },
      data: { label: 'no handle' },
      width: 80,
      parentNode: 2,
      height: 40,
      bgColor: 'white',
    },
    {
      id: 6,
      position: { x: 450, y: 480 },
      data: { html: ` <ul><li>Coffee</li><li>Tea</li><li>Milk</li></ul> ` },
      width: 100,
      height: 80,
      bgColor: 'white',
    },
  ];

  const initialEdges = [
    { id: 'e1-2', source: 1, target: 2, label: 'edge label' },
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
    { id: 'e2-6', source: 4, target: 6, type: 'straight' },
    {
      id: 'e2-7',
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
  width={970}
  height={620}
  initialZoom={2}
  initialLocation={initialNodes[3].position}
  minimap={true}
  background
/>
