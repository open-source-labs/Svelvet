<h2 class="text-4xl font-semibold mb-12">Diagram Boundary</h2>

<p class="text-gray-600">
  <code class="bg-rose-100 rounded-lg p-1">Svelvet</code> now has an optional boundary that users can implement into their diagrams!
  To access this feature, pass the <code class="bg-rose-100 rounded-lg p-1">boundary</code> prop to your <code class="bg-rose-100 rounded-lg p-1">Svelvet</code> application and set it equal to an object. 
  Give the <code class="bg-rose-100 rounded-lg p-1">boundary</code>  object an <code class="bg-rose-100 rounded-lg p-1">x</code> and <code class="bg-rose-100 rounded-lg p-1">y</code> key and set their values to a <code class="bg-rose-100 rounded-lg p-1">positive</code> number.
  The <code class="bg-rose-100 rounded-lg p-1">x</code> and <code class="bg-rose-100 rounded-lg p-1">y</code> properties represent the width and height of your <code class="bg-rose-100 rounded-lg p-1">boundary</code> and will create 
  a <code class="bg-rose-100 rounded-lg p-1">boundary</code> starting from <code class="bg-rose-100 rounded-lg p-1">0</code> to the number specified. 
  Do not set node positions to negative values while using the <code class="bg-rose-100 rounded-lg p-1">boundary</code> feature.
</p>

<div>
  <h3 class="text-xl font-semibold mt-12 mb-6">Implementing Diagram Boundaries</h3>
  <p class="text-gray-600">
    See the Code Sandbox below to see implementation!
  </p>
</div>

<iframe src="https://codesandbox.io/embed/boundary-wf9f8j?autoresize=1&fontsize=14&module=%2FApp.svelte&theme=dark"
style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
title="Custom Svelte Components"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>