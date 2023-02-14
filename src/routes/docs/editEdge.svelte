<script>
  import editEdgeDemo from '../../assets/features/feature_node_edge_edit.gif';
</script>

<h2 class="text-4xl font-semibold mb-12">Interactive Editable Nodes and Edges</h2>

<p class="text-gray-600">
  <code class="bg-rose-100 rounded-lg p-1">Svelvet</code> also allows users to
  interactively edit nodes and edges in their diagrams using the <code class="bg-rose-100 rounded-lg p-1">editable</code>
  prop. 
  <code class="bg-rose-100 rounded-lg p-1">Right click</code> on a node or edge to bring
  up a modal that will have customizable options! You can also delete nodes and edges using this modal.
</p>

<br />
<img alt="Edge edit demo" src={editEdgeDemo} />

<h3 class="text-xl font-semibold mt-12 mb-6">Sandbox</h3>

<p class="text-gray-600">
  Click <a
    href="https://stackblitz.com/edit/edit-edge?file=src/routes/+layout.svelte"
    style="color: blue">here</a
  > for a sandbox!
</p>

<!--The iframe below is a Code Sandbox demo for the same feature. However, Code Sandbox is having issue during Svelvet 6 launch time. That's why we switch to Stackblitz instead-->

<!-- <iframe src="https://codesandbox.io/embed/feature-editable-edges-og7qbi?fontsize=14&hidenavigation=1&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="Feature Editable Edges"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe> -->
