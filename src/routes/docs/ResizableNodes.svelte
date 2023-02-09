<script lang="ts">
  import Svelvet from 'svelvet';
  const initialNodes = [
    {
      id: 1,
      position: { x: 453, y: 70 },
      data: { label: 'Resize me! ' },
      width: 120,
      height: 60,
      bgColor: '#FFE4E6',
    },
    {
      id: 4,
      position: { x: 700, y: 210 },
      data: { label: 'Drag the bottom right!' },
      width: 150,
      height: 100,
      bgColor: 'white',
    },
  ];

  const initialEdges = [
    {
      id: 'e1-4',
      source: 1,
      target: 4,
      type: 'bezier',
      animate: true,
    },
  ];
</script>

<div>
  <h2 class="text-4xl font-semibold mb-12">Resizable Nodes</h2>
</div>

<p class="text-gray-600">
  <code class="code">Svelvet</code> now makes nodes more powerful by enabling
  <code class="code">resizability</code> as a new default feature for all the nodes
  in Svelvet component. Hover your mouse to the right bottom corner of each node,
  you can see a purple mini dot attached. Drag the purple dot and see what happens!
</p>

<br />
<p class="text-gray-600">
  Click <a
    href="https://stackblitz.com/edit/dynamic-anchor?file=README.md"
    style="color: blue">here</a
  > for a sandbox, or test it out below!
</p>

<br />

<div
  class="overflow-hidden my-8 border border-gray-200 rounded-lg shadow-lg shadow-slate-100"
>
  <Svelvet
    nodes={initialNodes}
    edges={initialEdges}
    width={1500}
    height={500}
    movement={true}
    background
    snap={true}
    snapTo={30}
    initialLocation={{ x: 753, y: 220 }}
  />
</div>

<!-- 
<iframe
  src="https://codesandbox.io/embed/feature-resizable-nodes-unnyfj?fontsize=14&hidenavigation=1&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="Feature Resizable Nodes"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>
 -->
<style>
</style>
