<script>
</script>

<div>
    <div>
  <h2 class="text-4xl font-semibold mb-12">Node-Grouping</h2>

  <p class="my-4 text-gray-600">
   Svelvet supports node grouping so you can multiple nodes at once. you merely need to specify childNodes propery within your initial nodes declaration. Keep in mind that currently a child node with its own children will need to have them specified with the grandparent in order to move themselves. See the example sandbox below to test and tinker with the nodes.
</p>

<ul>
<li class="flex items-center justify-between py-1 border-b">
    <code class="code">childNodes</code>
    <div class="w-2/3">Array of numbers, put other nodes id's in here</div>
</li>
</ul> 

</div>

<h3 class="text-xl font-semibold mt-12">Node-Grouping</h3>
<iframe
src = "https://codesandbox.io/embed/node-grouping-b0zzs6?file=/App.svelte?file=/App.svelte?file=/App.svelte?autoresize=1&codemirror=1&fontsize=14&hidenavigation=1&module=%2FApp.svelte&theme=dark&view=split&editorsize=50"

style="width:100%; height:500px; border:0; border-radius: 8px; overflow:hidden;"
title="custom-nodes"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>



</div>
