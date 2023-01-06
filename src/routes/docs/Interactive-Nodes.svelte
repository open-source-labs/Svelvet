<h2 class="text-4xl font-semibold mb-12">Interactive Node Linking & Creation</h2>

<p class="text-gray-600">
  <code class="bg-rose-100 rounded-lg p-1">Svelvet</code> allows users to enable interactive node linking and creation in their diagrams. 
  Initially, node linking and creation is <code class="bg-rose-100 rounded-lg p-1">not enabled</code> by default. To access these features, add the <code class="bg-rose-100 rounded-lg p-1">nodeLink</code> and <code class="bg-rose-100 rounded-lg p-1">nodeCreate</code>
  props to your <code class="bg-rose-100 rounded-lg p-1">Svelvet</code> application. These do not have to be set equal to anything and can just be passed in. 
  Adding these props will enable interactive node linking and creation. NOTE: To have full access to the node creation feature, node linking feature must also be passed down as a prop.
  Node <code class="bg-rose-100 rounded-lg p-1">anchors</code> will turn <code class="bg-rose-100 rounded-lg p-1">red</code> and the <code class="bg-rose-100 rounded-lg p-1">cursor</code> 
  will change to a <code class="bg-rose-100 rounded-lg p-1">crosshair</code> to indicate that node linking or creation is <code class="bg-rose-100 rounded-lg p-1">enabled</code>. If the user
  wishes to not create a node after clicking on the <code class="bg-rose-100 rounded-lg p-1">anchor</code> simply go back to that anchor and release the mouse click.
</p>

<div>
  <h3 class="text-xl font-semibold mt-12 mb-6">Implementing Node Linking & Creation</h3>
  <p class="text-gray-600">
    See the Code Sandbox below to see implementation!
  </p>
</div>

<iframe src="https://codesandbox.io/embed/interactive-node-link-and-creation-kc2vuj?autoresize=1&fontsize=14&hidenavigation=1&module=%2FApp.svelte&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Interactive Node Link and Creation"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>