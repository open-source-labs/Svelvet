<h2 class="text-4xl font-semibold mb-12">Interactive Editable Nodes</h2>

<p class="text-gray-600">
  <code class="bg-rose-100 rounded-lg p-1">Svelvet</code> allows users to interactively edit nodes in their diagrams. 
  To access this feature, pass the  <code class="bg-rose-100 rounded-lg p-1">editable</code> prop and set the value to true into your <code class="bg-rose-100 rounded-lg p-1">Svelvet</code> application 
  and <code class="bg-rose-100 rounded-lg p-1">right-click</code> on any node to bring up a modal that will have customizable options!
  Nodes with custom classes cannot be edited via the modal because their class styling will take priority. 
</p> 

<div>
  <h3 class="text-xl font-semibold mt-12 mb-6">Implementing Editable Nodes</h3>
  <p class="text-gray-600">
    See the Code Sandbox below to see implementation!
  </p>
</div>

<iframe src="https://codesandbox.io/embed/edit-nodes-cjtv8k?autoresize=1&fontsize=14&hidenavigation=1&module=%2FApp.svelte&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="edit Nodes"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>