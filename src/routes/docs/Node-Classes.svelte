<script>
  import Svelvet from 'svelvet';
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
      /* insert className: '<yourCustomClass>' to see how you can apply custom node styling to existing nodes' */
    },
    {
      id: 3,
      position: { x: 225, y: 260 },
      data: { label: 'Output Node' },
      width: 100,
      height: 40,
      bgColor: '#FFE4E6',
    },
    {
      id: 4,
      position: { x: 25, y: 180 },
      data: { label: 'Drag me!' },
      width: 125,
      height: 40,
      bgColor: 'white',
      targetPosition: 'right',
    },
    {
      id: 5,
      position: { x: 390, y: 380 },
      data: { label: 'Custom Node' },
      width: 125,
      height: 40,
      bgColor: '#C8FFC7',
      borderColor: 'transparent',
      borderRadius: 0,
    },
    {
      id: 6,
      position: { x: 47.5, y: 360 },
      data: { label: 'I am NOT green' },
      width: 80,
      height: 80,
      borderColor: '#FF4121',
      borderRadius: 30,
      bgColor: 'white',
      textColor: '#FF4121',
    },
    {
      id: 1,
      position: { x: 175, y: 25 },
      data: { label: 'This is a custom class' },
      className: 'customClass',
      targetPosition: 'right',
      sourcePosition: 'left',
    },
  ];

  const initialEdges = [
    {
      id: 'e2-3',
      source: 2,
      target: 3,
      animate: true,
      label: 'animated edges',
    },
    {
      id: 'e1-4',
      source: 1,
      target: 4,
      type: 'step',
      animate: true,
      edgeColor: '#FF4121',
    },
    {
      id: 'e2-5',
      source: 2,
      target: 5,
      label: 'colored edges',
      animate: true,
      arrow: true,
      edgeColor: '#FF4121',
      labelBgColor: '#1F2937',
      labelTextColor: '#FFE4E6',
    },
    { id: 'e4-6', source: 4, target: 6, type: 'straight' },
    {
      id: 'e3-6',
      source: 3,
      target: 6,
      type: 'smoothstep',
      label: 'colored label',
      labelBgColor: '#FF4561',
      labelTextColor: 'white',
      animate: true,
    },
  ];
</script>

<div>
  <h2 class="text-4xl font-semibold mb-12">Node Classes</h2>
  <p class="my-4 text-gray-600">
    <code class="code">Svelvet 5.0</code> also brings on an extra layer of customization
    in creating your diagrams. This is achieved with the implementation of custom
    classes with custom styling that you, the user, can input.
  </p>
  <p class="my-4 text-gray-600">
    <strong> *Setup* </strong> <br /> It is important to note that you must add
    a key value pair to your node object in initialNodes. It should look
    something like this: <br />
    <code class="code"> className: 'yourCustomClass'</code>.
  </p>
  <p class="my-4 text-gray-600">
    Also include the <code class="code"> :global </code> keyword, and mark CSS
    as
    <code class="code"> !important</code>. See sandbox for an example.
  </p>
  <p />
</div>

<div>
  <h3 class="text-xl font-semibold mt-12 mb-6">Implementing Node classes</h3>
  <p class="text-gray-600">
    Click <a
      href="https://stackblitz.com/edit/node-classes?file=src/routes/+layout.svelte"
      style="color: blue">here</a
    > for a sandbox, or test it out below!
  </p>
</div>

<Svelvet
  nodes={initialNodes}
  edges={initialEdges}
  width={600}
  background
  initialZoom={2}
  initialLocation={{ x: 400, y: 380 }}
/>

<!--   
  <iframe src="https://codesandbox.io/embed/custom-node-styling-doc-r835sf?autoresize=1&fontsize=14&module=%2FApp.svelte&theme=dark"
       style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
       title="Custom Svelte Components"
       allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
       sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  ></iframe>
   -->
<style>
  :global(.customClass) {
    width: 300px !important;
    height: 300px !important;
    background-color: #e07589 !important;
    box-shadow: 0px -50px 0px 0px #c1f9ff, 0px 50px 0px 0px #ff4121 !important;
  }
</style>
