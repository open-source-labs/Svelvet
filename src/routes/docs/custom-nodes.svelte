<!-- Codesandbox and properties of nodes / customization -->
<script>
  const nodeProps = [
    ['id', '(required) number'],
    ['data', '(required) { label: string }'],
    ['position', '(required) { x: number, y: number }'],
    ['sourcePosition', 'string (top, bottom, left, right) - defaults to "bottom" if unspecified'],
    ['targetPosition', 'string (top, bottom, left, right) - defaults to "top" if unspecified'],
    ['width', '(required) number'],
    ['height', '(required) number'],
    ['bgColor', 'string of color name, hexcode, or rgb'],
    ['borderColor', 'string of color name, hexcode or rgb'],
    ['textColor', 'string of color name, hexcode or rgb'],
    ['image', 'boolean'],
    ['src', 'string of image url'],
    ['borderRadius', 'number'],
    ['clickCallback', 'Function']
  ];
</script>

<div>
  <h2 class="text-4xl font-semibold mb-12">Custom Nodes</h2>
</div>

<p class="text-gray-600">
  <code class="code">Svelvet</code> provides the ability to customize each node to your liking. To customize
  your nodes, provide any of the following properties below in the node object. You can display your
  desired text, change colors (background, border and text), define multiple source and target handles,
  and set your own dimensions. Below you can find example implementations of these properties.
</p>
<p class="text-gray-600 mt-2">
  Current customizations include node
  {#each nodeProps as [key], i}
    <code class="code">{key}</code>{#if i < nodeProps.length - 2}{', '}
    {:else if i === nodeProps.length - 2}{', and '}
    {:else}.{/if}
  {/each}
</p>
<!-- NOTE: may want to add note regarding differences when using an image with / without a label -->

<h3 class="text-xl font-semibold mt-12">Node Properties</h3>
<div class="w-full md:w-3/4 lg:w-1/2 text-gray-600">
  <ul>
    <li class="flex items-center justify-between py-2 border-b-2">
      <div class="font-semibold">key</div>
      <div class="w-2/3 font-semibold">value</div>
    </li>
    {#each nodeProps as nodeProp}
      <li class="flex items-center justify-between py-1 border-b">
        <code class="code">{nodeProp[0]}</code>
        <div class="w-2/3">{nodeProp[1]}</div>
      </li>
    {/each}
  </ul>
</div>

<h3 class="text-xl font-semibold mt-12 mb-6">Implementing Custom Nodes</h3>

<iframe
  src="https://codesandbox.io/embed/custom-nodes-gl35z6?autoresize=1&codemirror=1&fontsize=14&hidenavigation=1&module=%2FApp.svelte&theme=dark&view=split&editorsize=50"
  style="width:100%; height:500px; border:0; border-radius: 8px; overflow:hidden;"
  title="custom-nodes"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>
