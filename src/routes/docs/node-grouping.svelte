<script>
  import Svelvet from '$lib/container/views/Svelvet.svelte';

  const initialNodes = [
    {
      id: 1,
      position: { x: 250, y: 250 },
      data: { label: 'Parent' },
      width: 75,
      height: 75,
      bgColor: 'white',
      borderRadius: 50,
      borderColor: 'red',
      childNodes: [2, 3, 4, 5, 6, 7],
    },
    {
      id: 2,
      position: { x: 100, y: 100 },
      data: { label: 'borderColor' },
      width: 150,
      height: 40,
      borderColor: 'red',
      bgColor: 'white',
    },
    {
      id: 3,
      position: { x: 400, y: 100 },
      data: { label: 'textColor' },
      width: 150,
      height: 40,
      textColor: '#3F6FD6',
      bgColor: 'white',
    },
    {
      id: 4,
      position: { x: 50, y: 300 },
      data: { label: 'Danny Pink' },
      width: 150,
      height: 40,
      textColor: 'white',
      borderColor: 'transparent',
      bgColor: '#FF9ABD',
    },
    {
      id: 5,
      position: { x: 500, y: 250 },
      data: { label: 'width and height' },
      width: 90,
      height: 110,
      bgColor: 'white',
    },
    {
      id: 6,
      position: { x: 500, y: 500 },
      data: { label: 'borderRadius' },
      width: 100,
      height: 100,
      bgColor: 'orange',
      borderRadius: 30,
      borderColor: 'blue',
    },
    {
      id: 7,
      position: { x: 50, y: 500 },
      data: { label: 'clickCallback' },
      width: 150,
      height: 40,
      bgColor: 'white',
      childNodes: [8, 9],
      clickCallback: (node) => console.log(node),
    },
    {
      id: 8,
      position: { x: 50, y: 575 },
      data: { label: 'childNode1' },
      width: 75,
      height: 50,
    },
    {
      id: 9,
      position: { x: 150, y: 575 },
      data: { label: 'childNode2' },
      width: 100,
      height: 50,
    },
  ];

  const initialEdges = [
    { id: 'e1-2', source: 1, target: 2, label: 'connection' },
    { id: 'e2-3', source: 2, target: 3, label: 'label' },
    {
      id: 'e1-4',
      source: 1,
      target: 4,
      label: 'box',
      animate: true,
      arrow: true,
    },
    { id: 'e2-5', source: 1, target: 5, animate: true },
    { id: 'e1-6', source: 1, target: 6, arrow: true },
    { id: 'e1-7', source: 1, target: 7, animate: true },
    {
      id: 'e7-8',
      source: 7,
      target: 8,
      arrow: true,
      animate: true,
      label: 'child',
    },
    {
      id: 'e7-9',
      source: 7,
      target: 9,
      arrow: true,
      animate: true,
      label: 'child',
    },
  ];
</script>

<div>
  <div>
    <h2 class="text-4xl font-semibold mb-12">Node-Grouping</h2>

    <p class="my-4 text-gray-600">
      Svelvet supports node grouping so you can select multiple nodes at once.
      You merely need to specify 'childNodes' property within your initial nodes
      declaration. Keep in mind that children of child nodes need to be
      specified in the grandparent in order to move with it. See the example
      sandbox below to test and tinker with the nodes.
    </p>

    <ul>
      <li class="flex items-center justify-between py-1 border-b">
        <code class="code">childNodes:[2,4]</code>
      </li>
    </ul>
  </div>

  <h3 class="text-xl font-semibold mt-12">Node-Grouping</h3>
  <br />
  <p class="text-gray-600">
    Click <a
      href="https://stackblitz.com/edit/node-grouping-asdfsdf?file=src/routes/+layout.svelte"
      style="color: blue">here</a
    > for a sandbox, or test it out below!
  </p>
  <br />
  <Svelvet
    nodes={initialNodes}
    width={500}
    height={500}
    edges={initialEdges}
    initialZoom={1}
    initialLocation={{ x: 350, y: 350 }}
    background
  />

  <!-- 
<iframe src="https://codesandbox.io/embed/node-grouping-forked-hq4r53?autoresize=1&fontsize=14&hidenavigation=1&module=%2FApp.svelte&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Node-Grouping (forked)"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>
 -->
</div>
