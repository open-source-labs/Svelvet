<script>
  import Svelvet6 from 'svelvet';
  import Svelvet5 from 'svelvetrabbits';

  const initialNodes = [
    {
      id: 1,
      position: { x: -100, y: -100 },
      data: { label: '1' },
      width: 50,
      height: 30,
      bgColor: 'white',
    },
    {
      id: 2,
      position: { x: 0, y: 0 },
      data: { label: '2' },
      width: 50,
      height: 30,
      bgColor: 'white',
      textColor: 'black',
    },
    {
      id: 3,
      position: { x: -250, y: -100 },
      data: { label: '3' },
      width: 50,
      height: 30,
      bgColor: 'white',
      borderColor: 'black',
    },
    {
      id: 4,
      position: { x: 150, y: -10 },
      data: { label: '4' },
      width: 50,
      height: 30,
      bgColor: 'white',
      textColor: 'black',
    },
    {
      id: 5,
      position: { x: -50, y: 100 },
      data: { label: '5' },
      width: 50,
      height: 30,
      bgColor: 'white',
      textColor: 'black',
      borderColor: 'black',
    },
  ];

  const initialEdges = [
    { id: 'e2-1', source: 2, target: 1 },
    { id: 'e3-1', source: 3, target: 1 },
    { id: 'e5-2', source: 5, target: 2 },
    { id: 'e1-4', source: 1, target: 4 },
  ];
</script>

<div>
  <h2 class="text-4xl font-semibold mb-12">Adaptive Anchors</h2>
</div>

<p class="text-gray-600">
  Edges now arrange themselves in an aesthetically pleasing way without need for
  user input!
</p>
<!-- 
<iframe
  src="https://codesandbox.io/embed/adaptive-anchors-demo-hlg140?fontsize=14&hidenavigation=1&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="adaptive-anchors-demo"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>
 -->

<p class="text-gray-600">
  Click <a
    href="https://stackblitz.com/edit/adaptiveanchors?file=src/routes/+layout.svelte"
    style="color: blue">here</a
  > for a sandbox, or test it out below!
</p>

<br />

<table>
  <tr>
    <td>New adaptive anchors!!</td>
    <td>
      <Svelvet6
        nodes={initialNodes}
        edges={initialEdges}
        width={600}
        height={300}
      /></td
    >
  </tr>
  <tr>
    <td>Old fixed anchors</td>

    <td
      ><Svelvet5
        nodes={initialNodes}
        edges={initialEdges}
        width={700}
        height={300}
      /></td
    >
  </tr>
</table>

<style>
  :global(.customClass) {
    width: 300px;
    height: 300px;
    background-color: #e07589;
    box-shadow: 0px -50px 0px 0px #c1f9ff, 0px 50px 0px 0px #ff4121 !important;
  }
  table,
  td {
    border: 1px solid black;
  }
</style>
