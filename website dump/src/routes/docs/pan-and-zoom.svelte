<script lang="ts">
  
  import Svelvet from 'svelvet';

  // Example data for how library is to be used
  const initialNodes = [
    {
      id: 11,
      type: 'input',
      position: { x: 100, y: 50 },
      data: { label: 'Input Node' },
      width: 175,
      height: 40,
      bgColor: 'white'
    },
    {
      id: 12,
      type: 'default',
      position: { x: 350, y: 250 },
      data: { label: 'Default Node' },
      width: 175,
      height: 40,
      bgColor: 'white'
    },
    {
      id: 13,
      type: 'output',
      position: { x: 40, y: 400 },
      data: { label: 'Another Output!' },
      width: 175,
      height: 40,
      bgColor: 'white'
    },
    {
      id: 14,
      type: 'output',
      position: { x: 400, y: 530 },
      data: { label: 'You found me!' },
      width: 175,
      height: 40,
      bgColor: '#D3FFC3',
      textColor: '#FF7C70'
    },
    {
      id: 15,
      type: 'output',
      position: { x: 50, y: 200 },
      data: { label: 'Output Node' },
      width: 175,
      height: 40,
      bgColor: 'white'
    }
  ];

  const initialEdges = [
    { id: 'e1-2', source: 11, target: 12 },
    { id: 'e2-3', source: 12, target: 13, animate: true },
    { id: 'e2-4', source: 12, target: 14, label: 'pan to see below!', animate: true },
    { id: 'e1-5', source: 11, target: 15 }
  ];
</script>

<h2 class="text-4xl font-semibold mb-8">Panning and Zooming</h2>
<p class="my-8 text-gray-600">
  The pan and zoom feature of <code class="bg-rose-100 rounded-lg p-1">Svelvet</code> allows you to
  pan by <strong>dragging</strong> and zoom by <strong>scrolling</strong> or
  <strong>pinching</strong>
  (mobile) by default.
  <br />
  <br />
  Play around with the flow diagram below!
</p>
<div class="overflow-hidden my-8 border border-gray-200 rounded-lg shadow-lg shadow-slate-100">
  <Svelvet
    nodes={initialNodes}
    edges={initialEdges}
    width={1000}
    height={500}
    background
    movement={true}
  />
</div>
<br /> <i>**As of v3.0.0, simply provide the</i> <code class="code">movement</code>
<i>attribute and set it's value to</i> <code class="code">false</code><i> directly in the </i>
<code class="code">Svelvet</code><i
  >component to prevent movement of the nodes and edges as well as prevent panning and zooming and
  fix the entire component in place.**</i
>

<style>
</style>
