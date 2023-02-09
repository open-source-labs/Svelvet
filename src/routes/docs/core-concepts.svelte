<script>
  import Svelvet from 'svelvet';

  const initialNodes = [
    {
      id: 1,
      position: { x: 150, y: 50 },
      data: { label: 'Landing Page' },
      width: 175,
      height: 40,
      bgColor: 'white',
    },
    {
      id: 2,
      position: { x: 50, y: 150 },
      data: { label: 'Register' },
      width: 150,
      height: 40,
      bgColor: 'white',
    },
    {
      id: 3,
      position: { x: 300, y: 150 },
      data: { label: 'Login' },
      width: 150,
      height: 40,
      bgColor: 'white',
    },
    {
      id: 4,
      position: { x: 300, y: 250 },
      data: { label: '2-Step Verification' },
      width: 150,
      height: 40,
      bgColor: 'white',
    },
    {
      id: 5,
      position: { x: 200, y: 350 },
      data: { label: 'Account Page' },
      width: 150,
      height: 40,
      bgColor: 'white',
    },
    {
      id: 6,
      position: { x: 400, y: 350 },
      data: { label: 'Initialize purchase process' },
      width: 150,
      height: 50,
      bgColor: 'white',
    },
    {
      id: 7,
      position: { x: 300, y: 450 },
      data: { label: 'Finalize purchase' },
      width: 150,
      height: 50,
      bgColor: '#B8FFC6',
      borderColor: '#B8FFC6',
    },
    {
      id: 8,
      position: { x: 500, y: 450 },
      data: { label: 'User Exits' },
      width: 150,
      height: 50,
      bgColor: '#FFB8B8',
      borderColor: '#FFB8B8',
    },
  ];

  const initialEdges = [
    { id: 'e1-2', source: 1, target: 2 },
    { id: 'e1-3', source: 1, target: 3, animate: true },
    { id: 'e2-3', source: 2, target: 5 },
    { id: 'e3-4', source: 3, target: 4, animate: true },
    { id: 'e4-5', source: 4, target: 5 },
    { id: 'e4-6', source: 4, target: 6, animate: true },
    { id: 'e6-7', source: 6, target: 7, animate: true },
    { id: 'e6-8', source: 6, target: 8 },
  ];
</script>

<div>
  <h2 class="text-4xl font-semibold mb-12">Core Concepts</h2>
  <h3 class="text-xl font-semibold">How Does Svelvet Work?</h3>
  <p class="my-4 text-gray-600">
    A <code class="bg-rose-100 rounded-lg p-1">Svelvet</code> flow component
    renders any number of nodes and edges. As a user of the component, you can
    pass arrays of
    <code class="bg-rose-100 rounded-lg p-1">nodes</code>
    and <code class="bg-rose-100 rounded-lg p-1">edges</code> as props to the
    Svelvet component. Under the hood, Svelvet will render the nodes with
    information provided in the
    <code class="bg-rose-100 rounded-lg p-1">nodes</code> array and connect them
    with edges depending on its source and target IDs provided in the
    <code class="bg-rose-100 rounded-lg p-1">edges</code> array, which correspond
    to the IDs of the nodes to connect.
  </p>
</div>
<div>
  <h3 class="text-xl font-semibold mt-12">Use Cases</h3>
  <p class="my-4 text-gray-600">
    There are many reasons why you may want to include a flow diagram in your
    application or website. Some of these use cases include:
  </p>
  <ul class="ml-8 text-gray-600">
    <li>User flows</li>
    <li>Project management</li>
    <li>HR organization charts</li>
    <li>Operational procedures</li>
    <li>Business planning</li>
    <li>... and so much more!</li>
  </ul>
  <p class="my-4 text-gray-600">
    Below is a quick example of using <code class="bg-rose-100 rounded-lg p-1"
      >Svelvet</code
    >
    to display a diagram mapping out the purchase flow of an application, or click
    <a
      href="https://stackblitz.com/edit/sveltejs-kit-template-default-8dtt82?file=src/routes/+layout.svelte"
      style="color: blue">here</a
    > for a sandbox!
  </p>
</div>
<Svelvet
  nodes={initialNodes}
  edges={initialEdges}
  width={800}
  height={400}
  background
  initialZoom={2}
  initialLocation={initialNodes[3].position}
/>

<!-- 
<iframe
  src="https://codesandbox.io/embed/core-concepts-yixl8c?autoresize=1&codemirror=1&fontsize=14&hidenavigation=1&module=%2FApp.svelte&theme=dark&view=preview"
  style="width:100%; height:600px; border:0; border-radius: 8px; overflow:hidden;"
  title="core-concepts"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>
 -->
<style>
  li {
    list-style-type: circle;
  }
</style>
