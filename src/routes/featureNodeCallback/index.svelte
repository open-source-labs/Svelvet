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
      clickCallback: (node) => {
        console.log('node object: ', node);
      },
    },
  ];

  const initialEdges = [];
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
