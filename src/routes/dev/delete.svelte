<h2 class="text-4xl font-semibold mb-12">Deletable Nodes</h2>

<p class="text-gray-600">
  <code class="bg-rose-100 rounded-lg p-1">Svelvet</code> allows for users to
  enable an optional delete feature in their diagrams. To access this feature,
  simply add the <code class="bg-rose-100 rounded-lg p-1">deleteNodes</code>
  prop to your <code class="bg-rose-100 rounded-lg p-1">Svelvet</code>
  application. If you only want the delete feature for specific nodes, add the key
  <code class="bg-rose-100 rounded-lg p-1">delete</code>
  to any node and set the value to
  <code class="bg-rose-100 rounded-lg p-1">true</code>. The edit modal feature
  also has the ability to delete nodes if you do not want the red delete button
  on your nodes.
</p>

<div>
  <h3 class="text-xl font-semibold mt-12 mb-6">Implementing Deletable Nodes</h3>
  <p class="text-gray-600">See the Code Sandbox below to see implementation!</p>
</div>

<!-- 
<iframe src="https://codesandbox.io/embed/eloquent-mendel-v5wr5l?autoresize=1&fontsize=14&module=%2FApp.svelte&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Custom Svelte Components"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>
 -->

<iframe
  src="https://stackblitz.com/edit/custom-svelte?embed=1&file=src/routes/About.svelte"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="adaptive-anchors-demo"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

<p>
  StackBlitz embeds do not work on non-Chromium browsers. If you are using
  Firefox, use this direct <a
    href="https://stackblitz.com/edit/custom-svelte?file=src/routes/About.svelte"
    style="color: blue">link</a
  > instead
</p>
