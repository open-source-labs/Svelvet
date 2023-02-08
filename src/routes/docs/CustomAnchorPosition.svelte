<script>
  import customAnchor from '../../assets/features/feature_custom_anchors.gif';
</script>

<div>
  <h2 class="text-4xl font-semibold mb-12">Custom Anchor Position</h2>
</div>

<p class="text-gray-600">
  The default anchors can appear at the top, bottom, left, or right center of the node but it does not always satisfy developers' specific needs. So Svelvet 6.0 introduces <code class="code">custom anchor position</code> as a new feature. Developers can now pass in a <code class="code">custom callback function</code> to decide where they want the anchors to appear on the node. 
</p>

<br/>
<img alt="Custom Anchor position demo" src={customAnchor} />


<h3 class="text-xl font-semibold mt-12 mb-6">Custom Anchor Position</h3>
<p class="text-gray-600">
  See the Code Sandbox below for the implementation!
</p>
<iframe src="https://codesandbox.io/embed/jolly-tess-p8vxf9?fontsize=14&hidenavigation=1&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="jolly-tess-p8vxf9"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

<br />

<p class="text-gray-600">
  See the Stackblitz below for the implementation!
</p>
<iframe src="https://stackblitz.com/edit/sveltejs-kit-template-default-w7fvtb?embed=1&file=src/routes/+page.svelte"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="jolly-tess-p8vxf9"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe> 
