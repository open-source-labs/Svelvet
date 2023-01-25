<script>
  import Svelvet from '$lib/views/RefactoredComponents/Svelvet.svelte';
  import Canvas from '$lib/views/DevTools/Canvas.svelte';

  const initialNodes = [
    {
      id: 1,
      position: { x: 110, y: 50 },
      data: {
        html: `<video width="480" height="360" src="https://i.imgur.com/zdT6tSz.mp4" autoplay loop></video>`,
      },
      width: 490,
      height: 370,
      bgColor: 'white',
    },
  ];

  const initialEdges = [];
</script>

<Svelvet nodes={initialNodes} edges={initialEdges} />
