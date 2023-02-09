<script>
  import Svelvet from 'svelvet';

  const initialNodes = [
    {
      id: 1,
      position: { x: 225, y: 10 },
      data: { label: 'Add Images!' },
      width: 100,
      height: 100,
      bgColor: 'white',
      borderColor: 'transparent',
      image: true,
      src: 'https://svelvet.io/_app/assets/Logo%201-cc7b0baf.svg',
    },
    {
      id: 2,
      position: { x: 390, y: 180 },
      data: { label: 'Mixed Anchors' },
      width: 125,
      height: 40,
      bgColor: 'white',
      targetPosition: 'left',
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
      height: 75,
      bgColor: '#C8FFC7',
      borderColor: 'transparent',
      borderRadius: 0,
    },
    {
      id: 6,
      position: { x: 47.5, y: 360 },
      data: { label: 'Custom Node' },
      width: 80,
      height: 80,
      borderColor: '#FF4121',
      borderRadius: 30,
      bgColor: 'white',
      textColor: '#FF4121',
    },
    {
      id: 7,
      position: { x: 800, y: 100 },
      data: { label: 'Woah, where am I?' },
      width: 200,
      height: 200,
      bgColor: 'white',
    },
    {
      id: 8,
      position: { x: 700, y: 100 },
      data: { label: 'Woah, where am I?' },
      width: 50,
      height: 175,
      bgColor: 'aqua',
    },
    {
      id: 9,
      position: { x: 400, y: 550 },
      data: { label: 'Woah, where am I?' },
      width: 50,
      height: 80,
      bgColor: 'green',
    },
    {
      id: 10,
      position: { x: 350, y: 10 },
      data: { label: 'Woah, where am I?' },
      width: 50,
      height: 75,
      bgColor: 'purple',
    },
    {
      id: 11,
      position: { x: 600, y: 500 },
      data: { label: 'Woah, where am I?' },
      width: 50,
      height: 200,
      bgColor: 'white',
    },
    {
      id: 12,
      position: { x: 200, y: 500 },
      data: { label: 'Woah, where am I?' },
      width: 50,
      height: 75,
      bgColor: 'white',
    },
    {
      id: 13,
      position: { x: 300, y: 600 },
      data: { label: 'Woah, where am I?' },
      width: 50,
      height: 75,
      bgColor: 'blue',
    },
    {
      id: 14,
      position: { x: 250, y: 670 },
      data: { label: 'Woah, where am I?' },
      width: 50,
      height: 75,
      bgColor: 'red',
    },
    {
      id: 15,
      position: { x: 150, y: 400 },
      data: { label: 'Woah, where am I?' },
      width: 75,
      height: 75,
      bgColor: 'white',
      targetPosition: 'left',
      sourcePosition: 'right',
    },
    {
      id: 16,
      position: { x: 75, y: 475 },
      data: { label: 'Woah, where am I?' },
      width: 75,
      height: 75,
      bgColor: 'white',
      targetPosition: 'right',
      sourcePosition: 'left',
    },
    {
      id: 17,
      position: { x: 500, y: 20 },
      data: { label: 'Add more nodes!' },
      width: 75,
      height: 75,
      bgColor: 'white',
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
    { id: 'e12-13', source: 12, target: 13, type: 'straight' },
    { id: 'e14-16', source: 14, target: 16, type: 'straight' },
    { id: 'e10-13', source: 10, target: 13, type: 'straight' },
  ];
</script>

<h2 class="text-4xl font-semibold mb-12">Diagram Boundary</h2>

<p class="text-gray-600">
  <code class="bg-rose-100 rounded-lg p-1">Svelvet</code> now has an optional
  boundary that users can implement into their diagrams! To access this feature,
  pass the <code class="bg-rose-100 rounded-lg p-1">boundary</code> prop to your
  <code class="bg-rose-100 rounded-lg p-1">Svelvet</code>
  application and set it equal to an object. Give the
  <code class="bg-rose-100 rounded-lg p-1">boundary</code>
  object an <code class="bg-rose-100 rounded-lg p-1">x</code> and
  <code class="bg-rose-100 rounded-lg p-1">y</code>
  key and set their values to a
  <code class="bg-rose-100 rounded-lg p-1">positive</code>
  number. The <code class="bg-rose-100 rounded-lg p-1">x</code> and
  <code class="bg-rose-100 rounded-lg p-1">y</code>
  properties represent the width and height of your
  <code class="bg-rose-100 rounded-lg p-1">boundary</code>
  and will create a <code class="bg-rose-100 rounded-lg p-1">boundary</code>
  starting from <code class="bg-rose-100 rounded-lg p-1">0</code> to the number
  specified. Do not set node positions to negative values while using the
  <code class="bg-rose-100 rounded-lg p-1">boundary</code> feature.
</p>

<div>
  <h3 class="text-xl font-semibold mt-12 mb-6">
    Implementing Diagram Boundaries
  </h3>
  <p class="text-gray-600">
    Click <a
      href="https://stackblitz.com/edit/sveltejs-kit-template-default-kjzkzt?file=src/routes/+layout.svelte"
      style="color: blue">here</a
    > for a sandbox, or test it out below!
  </p>
</div>

<br />

<Svelvet
  nodes={initialNodes}
  width={500}
  height={425}
  initialZoom={1}
  initialLocation={{ x: 225, y: 260 }}
  edges={initialEdges}
  bgColor={'#EEEEEE'}
  background
  minimap={true}
  nodeCreate
  boundary={{ x: 1050, y: 850 }}
/>

<!-- 
<iframe src="https://codesandbox.io/embed/boundary-wf9f8j?autoresize=1&fontsize=14&module=%2FApp.svelte&theme=dark"
style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
title="Custom Svelte Components"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>
-->
