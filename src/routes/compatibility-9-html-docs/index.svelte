<script>
  import Svelvet from 'svelvet';

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
</script>

<Svelvet nodes={initialNodes} edges={[]} />
