<script>
  import Svelvet from '$lib/Containers/Svelvet/index.svelte';
  // import Svelvet from 'svelvet';

  const handleClick = (e) => {
    console.log(e);
  };
  const initialNodes = [
    {
      id: 1,
      position: { x: 300, y: 150 },
      data: { label: 'Input Node' },
      width: 175,
      height: 40,
      bgColor: 'white',
      clickCallback: handleClick
    },
    {
      id: 2,
      position: { x: 200, y: 250 },
      data: { label: 'Option #1' },
      width: 175,
      height: 40,
      bgColor: '#B8FFC6',
      borderColor: 'transparent',
      clickCallback: handleClick
    },
    {
      id: 3,
      position: { x: 475, y: 150 },
      data: { label: 'Option #2' },
      width: 175,
      height: 40,
      bgColor: '#FFB8B8',
      borderColor: 'transparent',
      clickCallback: handleClick
    },
    {
      id: 4,
      position: { x: 300, y: 250 },
      data: { label: 'Output Node' },
      width: 175,
      height: 40,
      bgColor: 'white',
      clickCallback: handleClick
    }
  ];
  const initialEdges = [
    { id: 'e1-2', source: 1, target: 2, label: '  YES  ' },
    { id: 'e2-3', source: 1, target: 3, label: '  NO  ' },
    { id: 'e2-4', source: 2, target: 4, animate: true },
    { id: 'e2-5', source: 3, target: 4, animate: true }
  ];

  const otherNodes = [
    {
      id: 1,
      position: { x: 300, y: 50 },
      data: { label: 'New Input Node' },
      width: 175,
      height: 40,
      bgColor: 'white',
      clickCallback: handleClick
    },
    {
      id: 2,
      position: { x: 125, y: 150 },
      data: { label: 'New Option #1' },
      width: 175,
      height: 40,
      bgColor: '#B8FFC6',
      borderColor: 'transparent',
      clickCallback: handleClick
    },
    {
      id: 3,
      position: { x: 475, y: 150 },
      data: { label: 'New Option #2' },
      width: 175,
      height: 40,
      bgColor: '#FFB8B8',
      borderColor: 'transparent',
      clickCallback: handleClick
    },
    {
      id: 4,
      position: { x: 300, y: 250 },
      data: { label: 'New Output Node' },
      width: 175,
      height: 40,
      bgColor: 'white',
      clickCallback: handleClick
    }
  ];
  const otherEdges = [
    { id: 'e1-2', source: 1, target: 2, label: '  Correct  ', animate: true },
    { id: 'e2-3', source: 1, target: 3, label: '  Wrong  ', animate: true },
    { id: 'e2-4', source: 2, target: 4, noHandle: true },
    { id: 'e2-5', source: 3, target: 4, noHandle: true }
  ];
</script>

<Svelvet nodes={initialNodes} edges={initialEdges} width={600} background />
<p>Hello</p>
