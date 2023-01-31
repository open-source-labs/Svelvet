<script>
  //import Svelvet from '$lib/container/views/Svelvet.svelte';
  // import DeleteMe from '$lib/deleteMe.svelte';
  import DeleteMe from 'svelvet-lime';
  //import Svelvet from 'svelvet-lime';

  console.log(DeleteMe);

  const initialEdges = [];
</script>

<DeleteMe />

<!-- <Svelvet nodes={initialNodes} edges={initialEdges} /> -->
<style>
  :global(.customClass) {
    width: 300px;
    height: 300px;
    background-color: #e07589;
    box-shadow: 0px -50px 0px 0px #c1f9ff, 0px 50px 0px 0px #ff4121 !important;
  }
</style>
