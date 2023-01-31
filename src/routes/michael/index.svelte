<script>
  //import Svelvet from '$lib/container/views/Svelvet.svelte';
  // import DeleteMe from '$lib/deleteMe.svelte';
  // import DeleteMe from 'svelvet-lime';
  import Svelvet from 'svelvet-lime';

  const initialNodes = [
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

  const initialEdges = [
    { id: 'e1-2', source: 1, target: 2, label: 'edge label' },
  ];
</script>

<Svelvet nodes={initialNodes} edges={initialEdges} />

<style>
  :global(.customClass) {
    width: 300px;
    height: 300px;
    background-color: #e07589;
    box-shadow: 0px -50px 0px 0px #c1f9ff, 0px 50px 0px 0px #ff4121 !important;
  }
</style>
