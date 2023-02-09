<script>
  import Svelvet from 'svelvet';
  const initialNodes = [
    {
      id: 1,
      position: { x: 50, y: 300 },
      data: { label: 'borderColor' },
      targetPosition: 'right',
      sourcePosition: 'left',
      width: 80,
      height: 40,
      borderColor: 'red',
      bgColor: 'white',
    },
    {
      id: 2,
      position: { x: 50, y: 150 },
      data: { label: 'textColor' },
      width: 80,
      height: 40,
      textColor: '#3F6FD6',
      bgColor: 'white',
    },
    {
      id: 3,
      position: { x: 250, y: 150 },
      data: { label: '' },
      width: 75,
      height: 50,
      textColor: 'white',
      borderColor: 'transparent',
      bgColor: 'black',
      image: true,
      src: 'https://www.dropbox.com/s/bunxvjowj5fxosa/de3t.jpg?raw=1',
      alt: 'a carrot',
    },
    {
      id: 4,
      position: { x: 250, y: 500 },
      data: { label: 'Apple' },
      width: 100,
      height: 50,
      bgColor: 'red',
      borderRadius: 30,
    },
    {
      id: 5,
      position: { x: 450, y: 400 },
      data: { label: 'borderRadius' },
      width: 100,
      height: 50,
      bgColor: 'orange',
      borderRadius: 30,
    },
    {
      id: 7,
      position: { x: -500, y: -500 },
      data: { label: '123' },
      width: 100,
      height: 100,
      bgColor: 'orange',
      borderRadius: 30,
    },
    {
      id: 6,
      position: { x: -450, y: 400 },
      data: { label: 'I am far' },
      width: 100,
      height: 50,
      bgColor: 'green',
      borderRadius: 30,
    },
  ];
  const initialEdges = [
    { id: 'e3-4', source: 3, target: 4, animate: true, type: 'step' },
    { id: 'e1-6', source: 1, target: 6, animate: false },
    { id: 'e6-7', source: 6, target: 7, animate: false, type: 'step' },
  ];
</script>

<div>
  <h2 class="text-4xl font-semibold mb-12">Minimap</h2>

  <p class="my-4 text-gray-600">
    <code class="code">Svelvet 5.0</code> introduces a new optional feature that
    can be added to diagrams now. To access this feature set the minimap prop to
    <code class="code">{true}</code> in your Svelvet application.
  </p>
  <p class="my-4 text-gray-600">
    It is important to note that the minimap scales to your current zoom
    settings which you can affect by scrolling your mouse wheel up or down; if
    you are on a touchpad or touchscreen, expand or collapse and it should work
    the same way. Different browsers may have different settings.
  </p>

  <br />
  <p class="text-gray-600">
    Click <a
      href="https://stackblitz.com/edit/minimap-as34t2?file=src/routes/+layout.svelte"
      style="color: blue">here</a
    > for a sandbox, or test it out below!
  </p>
</div>
<br />

<Svelvet
  nodes={initialNodes}
  width={500}
  height={425}
  initialZoom={6}
  initialLocation={{ x: 150, y: 300 }}
  edges={initialEdges}
  bgColor={'#EEEEEE'}
  background
  minimap={true}
  nodeCreate
  nodeLink
/>

<!-- 
<iframe
  src="https://codesandbox.io/embed/minimap-website-documentation-9uy92c?autoresize=1&fontsize=14&module=%2FApp.svelte&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="Custom Svelte Components"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>
 -->
<style>
</style>
