<script>

</script>

<h2 class="text-4xl font-semibold mb-12">Initial Zoom & Location</h2>

<p class="text-gray-600">
  Implementing initial zoom & location to a <code class="bg-rose-100 rounded-lg p-1">Svelvet</code> application is now possible!
  To access this feature, simply add the prop <code class="bg-rose-100 rounded-lg p-1">initialZoom</code> and set it equal to a number from <code class="bg-rose-100 rounded-lg p-1">0 to 10</code>, <code class="bg-rose-100 rounded-lg p-1">0</code> being the most zoomed in and <code class="bg-rose-100 rounded-lg p-1">10</code> being the most zoomed out. 
  To access the initial location feature, add the prop <code class="bg-rose-100 rounded-lg p-1">initialLocation</code> and set it equal to an object with an <code class="bg-rose-100 rounded-lg p-1">x</code> and <code class="bg-rose-100 rounded-lg p-1">y</code> property like so <code class="bg-rose-100 rounded-lg p-1">x: 100, y:100</code> or <code class="bg-rose-100 rounded-lg p-1">initialNodes[1].position</code> would set it to default at that node's position.
</p>

<div>
  <h3 class="text-xl font-semibold mt-12 mb-6">Implementing Initial Zoom & Location</h3>
  <p class="text-gray-600">
    See the Code Sandbox below to see implementation!
  </p>
</div>

<iframe src="https://codesandbox.io/embed/initzoomloc-kx8stk?autoresize=1&fontsize=14&hidenavigation=1&module=%2FApp.svelte&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="InitZoomLoc"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>