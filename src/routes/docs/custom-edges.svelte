<script>
  const edgeProps = [
    ['id', '(required)'],
    ['source', '(required) node id'],
    ['target', '(required) node id'],
    ['type', '"straight" / set to "bezier" if not specified'],
    ['label', 'string'],
    ['animate', 'boolean'],
    ['arrow', 'boolean'],
    ['noHandle', 'boolean']
  ];
</script>

<h2 class="text-4xl font-semibold mb-12">Custom Edges</h2>

<p class="text-gray-600">
  <code class="bg-rose-100 rounded-lg p-1">Svelvet</code> also allows you to customize your edges.
  Currently, there are two edge types - straight and bezier. The default will be a bezier edge
  unless you set <code class="bg-rose-100 rounded-lg p-1">type: 'straight'</code>. You can also turn
  on edge animations by setting <code class="bg-rose-100 rounded-lg p-1">animation: true</code>.
  Lastly, optionally annotate your edges by providing a
  <code class="bg-rose-100 rounded-lg p-1">label</code>.
</p>

<h3 class="text-xl font-semibold mt-12">Edge Properties</h3>
<div class="w-full sm:w-3/4 md:w-3/4 lg:w-1/2 text-gray-600">
  <ul>
    <li class="flex items-center justify-between py-2 border-b-2">
      <div class="font-semibold">key</div>
      <div class="w-2/3 font-semibold">value</div>
    </li>
    {#each edgeProps as edgeProp}
      <li class="flex items-center justify-between py-1 border-b">
        <code class="code">{edgeProp[0]}</code>
        <div class="w-2/3">{edgeProp[1]}</div>
      </li>
    {/each}
  </ul>
</div>

<div>
  <h3 class="text-xl font-semibold mt-12 mb-6">Implementing Custom Edges</h3>
</div>

<iframe
  src="https://codesandbox.io/embed/custom-edges-dbtqj0?autoresize=1&codemirror=1&fontsize=14&hidenavigation=1&module=%2FApp.svelte&theme=dark&view=split&editorsize=50"
  style="width:100%; height:500px; border:0; border-radius: 8px; overflow:hidden;"
  title="custom-edges"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>
