<script>
  import Svelvet from 'svelvet';
  import Login from './assets/Login.svelte';
  import Home from './assets/Home.svelte';
  import About from './assets/About.svelte';

  const initialNodes = [
    {
      id: 1,
      position: { x: -550, y: -200 },
      data: { custom: Login },
      width: 300 * 0.8,
      height: 300 * 0.8,
      bgColor: 'white',
    },
    {
      id: 2,
      position: { x: -850, y: 250 },
      data: { custom: Home },
      width: 300,
      height: 300,
      bgColor: 'white',
    },
    {
      id: 3,
      position: { x: -450, y: 250 },
      data: { custom: About },
      width: 300,
      height: 300,
      bgColor: 'white',
    },
  ];

  const initialEdges = [
    { id: 'e1-2', source: 1, target: 2, label: 'connection' },
  ];
</script>

<h2 class="text-4xl font-semibold mb-12">Custom Svelte Components</h2>

<p class="text-gray-600">
  <code class="bg-rose-100 rounded-lg p-1">Svelvet</code> allows you to
  customize your nodes to have custom Svelte components as nodes! To access this
  feature, simply change the
  <code class="bg-rose-100 rounded-lg p-1">data</code>
  object's <code class="bg-rose-100 rounded-lg p-1">key</code> to
  <code class="bg-rose-100 rounded-lg p-1">custom</code>
  and <code class="bg-rose-100 rounded-lg p-1">value</code> to the name of the imported
  Svelte component.
</p>

<!-- 
<iframe src="https://codesandbox.io/embed/custom-svelte-components-p4ztve?autoresize=1&fontsize=14&hidenavigation=1&module=%2FApp.svelte&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Custom Svelte Components"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>
 -->

<div>
  <h3 class="text-xl font-semibold mt-12 mb-6">
    Implementing Custom Svelte Components
  </h3>
  <p class="text-gray-600">
    Click <a
      href="https://stackblitz.com/edit/custom-svelte?file=src/routes/About.svelte"
      style="color: blue">here</a
    > for a sandbox, or try it yourself below!
  </p>
</div>
<br />

<Svelvet
  nodes={initialNodes}
  width={500}
  height={500}
  initialZoom={0}
  initialLocation={initialNodes[2].position}
  edges={initialEdges}
  bgColor={'#EEEEEE'}
  nodeLink
  nodeCreate
  background
/>
