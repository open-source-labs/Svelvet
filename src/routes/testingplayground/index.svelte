<script>
  import Svelvet from '$lib/Containers/Svelvet/index.svelte';
  // import Svelvet from 'svelvet';

  const initialNodes = [
    {
      id: 1,
      type: 'input',
      position: { x: 0, y: 0 },
      data: { label: 'Input' },
      width: 175,
      height: 40,
      bgColor: 'rgb(255,69,97)',
      sourcePosition: 'right'
    },
    {
      id: 2,
      type: 'default',
      position: { x: 0, y: 100 },
      data: { label: 'Default' },
      width: 175,
      height: 40,
      bgColor: 'white'
    },
    {
      id: 3,
      type: 'output',
      position: { x: 0, y: 200 },
      data: { label: 'Output' },
      width: 175,
      height: 40,
      bgColor: 'white'
    },
    {
      id: 4,
      type: 'output',
      position: { x: 200, y: 200 },
      data: { label: 'Bye!' },
      width: 175,
      height: 40,
      bgColor: 'white'
    }
  ];
  const initialEdges = [
    {
      id: 'e1-2',
      source: 1,
      type: 'straight',
      target: 2,
      label: 'labeled edge',
      labelBgColor: 'blue'
    },
    { id: 'e2-3', source: 2, target: 3, label: 'another label' },
    { id: 'e2-4', source: 2, target: 4, label: 'animated edge', animate: true }
  ];
</script>

<Svelvet nodes={initialNodes} edges={initialEdges} />
