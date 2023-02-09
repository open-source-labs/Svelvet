<!-- Basic properties and how to change styles of edges  -->
<script>
  const edgeProps = [
    ['id', '(required) string'],
    ['source', '(required) node id'],
    ['target', '(required) node id'],
    [
      'type',
      'string ("straight", "bezier", "step", "smoothstep") - defaults to "bezier" if not specified',
    ],
    ['label', 'string'],
    ['labelBgColor', 'string of string of color name, hexcode, or rgb'],
    ['labelTextColor', 'string of color name, hexcode, or rgb'],
    ['edgeColor', 'string of color name, hexcode, or rgb'],
    ['animate', 'boolean'],
    ['arrow', 'boolean'],
    ['noHandle', 'boolean'],
  ];
</script>

<h2 class="text-4xl font-semibold mb-12">Custom Edges</h2>

<p class="text-gray-600">
  <code class="bg-rose-100 rounded-lg p-1">Svelvet</code> also allows you to
  customize your edges. Currently, there are four edge types - straight, bezier,
  step, and smoothstep. The default will be a bezier edge unless you set
  <code class="bg-rose-100 rounded-lg p-1">type:</code>
  <code class="bg-rose-100 rounded-lg p-1">'straight'</code>,
  <code class="bg-rose-100 rounded-lg p-1">'step'</code>, or
  <code class="bg-rose-100 rounded-lg p-1">'smoothstep'</code>. You can also
  turn on edge animations by setting
  <code class="bg-rose-100 rounded-lg p-1">animation: true</code>.
  <br /><br />Optionally customize the color of edges by setting
  <code class="bg-rose-100 rounded-lg p-1">edgeColor</code>
  to a color name, hexcode, or rgb value. Annotate your edges by providing a
  <code class="bg-rose-100 rounded-lg p-1">label</code>. Customize labels with
  <code class="bg-rose-100 rounded-lg p-1">labelBgColor</code>
  and <code class="bg-rose-100 rounded-lg p-1">labelTextColor</code> to change the
  background and text color of the label using color names, hexcodes, or rgb values.
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
<!-- 
<iframe
  src="https://codesandbox.io/embed/custom-edges-forked-omgm2t?autoresize=1&fontsize=14&hidenavigation=1&module=%2FApp.svelte&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="custom-edges (forked)"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>
 -->

<p class="text-gray-600">
  Click <a
    href="https://stackblitz.com/edit/custom-edges?file=README.md"
    style="color: blue">here</a
  > for a sandbox!
</p>
