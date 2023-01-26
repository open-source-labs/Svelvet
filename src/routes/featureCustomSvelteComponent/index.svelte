<script>
  import Svelvet from '$lib/views/RefactoredComponents/Svelvet.svelte';
  import Login from './DummyComponent.svelte';
  import Home from './DummyComponent.svelte';
  import About from './DummyComponent.svelte';

  const initialNodes = [
    {
      id: 1,
      position: { x: 0, y: 0 },
      data: { custom: Login },
      width: 50,
      height: 50,
      bgColor: 'white',
    },
    {
      id: 2,
      position: { x: 0, y: 250 },
      data: { custom: Home },
      width: 50,
      height: 100,
      bgColor: 'white',
    },
    {
      id: 3,
      position: { x: 100, y: 250 },
      data: { custom: About },
      width: 70,
      height: 300,
      bgColor: 'white',
    },
  ];

  const initialEdges = [
    { id: 'e1-2', source: 1, target: 2, label: 'connection' },
  ];
</script>

<Svelvet
  nodes={initialNodes}
  width={900}
  height={900}
  initialZoom={0}
  initialLocation={initialNodes[2].position}
  edges={initialEdges}
  bgColor={'#EEEEEE'}
  nodeLink
  nodeCreate
  background
/>
