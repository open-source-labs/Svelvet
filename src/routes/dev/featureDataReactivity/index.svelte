<script lang="ts">
  // import Svelvet from '$lib/container/views/Svelvet.svelte';
  // import {
  //   getD3PositionY,
  //   getD3PositionX,
  //   getD3Zoom,
  // } from '$lib/store/controllers/userApi';

  import Svelvet from 'svelvet';
  import { getD3PositionX, getD3PositionY, getD3Zoom } from 'svelvet';

  let initialNodes = [
    {
      id: '1',
      position: { x: 0, y: 0 },
      data: { label: 'borderColor' },
      width: 80,
      height: 40,
      borderColor: 'red',
      bgColor: 'white',
    },
    {
      id: '2',
      position: { x: 50, y: 150 },
      data: { label: 'textColor' },
      width: 80,
      height: 40,
      textColor: '#3F6FD6',
      bgColor: 'white',
    },
    {
      id: '3',
      position: { x: 250, y: 150 },
      data: { label: 'asdf' },
      width: 75,
      height: 50,
      textColor: 'white',
      borderColor: 'transparent',
      bgColor: 'black',
      alt: 'a carrot',
    },
    {
      id: '4',
      position: { x: 250, y: 500 },
      data: { label: 'Apple' },
      width: 100,
      height: 50,
      bgColor: 'red',
      borderRadius: 30,
    },
    {
      id: '5',
      position: { x: 450, y: 400 },
      data: { label: 'borderRadius' },
      width: 100,
      height: 50,
      bgColor: 'orange',
      borderRadius: 30,
    },
    {
      id: '7',
      position: { x: -500, y: -500 },
      data: { label: '123' },
      width: 100,
      height: 100,
      bgColor: 'orange',
      borderRadius: 30,
    },
    {
      id: '6',
      position: { x: -450, y: 400 },
      data: { label: 'I am far' },
      width: 100,
      height: 50,
      bgColor: 'green',
      borderRadius: 30,
    },
  ];
  let initialEdges = [
    { id: 'e3-4', source: '3', target: '4', animate: true },
    { id: 'e1-6', source: '1', target: '6', animate: false },
    { id: 'e6-7', source: '6', target: '7', animate: false },
  ];
  let newId = 9999;

  const addNodeAndEdge = () => {
    const newNode = {
      id: `${++newId}`,
      position: { x: 200, y: 250 },
      data: { label: newId.toString() },
      width: 50,
      height: 50,
    };
    const newEdge = {
      id: `edge-${newId}`,
      source: '2',
      target: newId.toString(),
      label: 'new edge',
    };
    initialNodes = [...initialNodes, newNode];
    initialEdges = [...initialEdges, newEdge];
  };

  $: zoom = 2;
  $: initialPosition = { x: 930, y: 850 };
</script>

<h1>Data Reactivity</h1>

<p>
  Pan zoom to a region on the screen. Click "alert d3 parameters". Write down
  the numbers
</p>
<p>
  Pan to another area of the screen. Type d3 parameters into data reactivity
  form. Click "data reactivity"
</p>
<p>Svelvet should re-render at previous coordinates and zoom</p>
<p>
  Note that Svelvet zooms in based on reference point (0,0). This means that if
  you jump to a random point (x,y) at zoom=1, then set zoom=2, you will NOT zoom
  in on (x,y) because initial zoom is set based on reference point (0,0)
</p>

<Svelvet
  canvasId={'1234asdf'}
  nodes={initialNodes}
  edges={initialEdges}
  width={900}
  height={600}
  initialZoom={zoom}
  background
  initialLocation={initialPosition}
  minimap={true}
/>

<button on:click={addNodeAndEdge}>add new node/edge</button>

<form
  on:submit|preventDefault={(e) => {
    const formData = new FormData(e.target);
    var data = {};
    formData.forEach((value, key) => (data[key] = value));
    initialPosition.x = Number(data['x']) + Math.random() * 0.001; // small random offset to force re-render
    initialPosition.y = Number(data['y']);
    zoom = Number(data['zoom']) + Math.random() * 0.001;
    initialPosition = initialPosition;
  }}
>
  <input name="x" placeholder="0" />
  <input name="y" placeholder="0" />
  <input name="zoom" placeholder="1" />
  <input type="submit" value="Data Reactivity" />
</form>

<button
  on:click={() => {
    // This is how you can get d3 parameters out from the store
    // '1234asdf' is the canvasId that you specified for the Svelvet component
    // Note that "zoom" is the zoom level based on reference point (0,0).
    const x = getD3PositionX('1234asdf');
    const y = getD3PositionY('1234asdf');
    const zoom = getD3Zoom('1234asdf');
    alert(`d3 parameters are: x=${x}, y=${y}, zoom=${zoom}`);
  }}>alert d3 parameters</button
>

<style>
  button {
    border: 1px solid black;
  }
  input {
    border: 1px solid black;
  }
</style>
