<script>
  import rachel from '../../assets/profiles/rachel.png';
  import DynamicAnchor from '../../assets/dynamicAnchorDemo.gif';
</script>

<div>
  <h2 class="text-4xl font-semibold mb-12">Dynamic Anchor</h2>
</div>

<p class="text-gray-600">
  <code class="code">Svelvet</code> now have
  <code class="code">dynamic anchors</code> as a new feature! Drag the nodes around
  and see what happens to the anchors!
</p>

<p class="text-gray-600">
  Now you don't even need to specify <code class="code">sourcePosition</code>
  and <code class="code">targetPosition</code> in your node object anymore because
  Svelvet is going to take care of generating optimal anchors based on the relative
  posistions between two nodes.
</p>

<img alt="Dynamic Anchor Demo" src={DynamicAnchor} />

<p class="text-gray-600">
  The diagram generated using Svelvet 6.0 below has dynamic anchors on every
  node. Drag the node around and see how the anchors are changing dynamically!
</p>

<h3 class="text-xl font-semibold mt-12 mb-6">Dynamic Anchors</h3>
<p class="text-gray-600">See the Code Sandbox below for the implementation!</p>

<br />

<iframe
  src="https://codesandbox.io/embed/feature-dynamic-anchors-fwmgmu?fontsize=14&hidenavigation=1&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="Feature Dynamic Anchors"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

<style>
  img {
    width: 500px;
    height: 500px;
  }
</style>
