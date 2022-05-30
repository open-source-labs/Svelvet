<script>
</script>

<div>
	<h2 class="text-4xl font-semibold mb-12">Core Concepts</h2>
	<h3 class="text-xl font-semibold">How Does Svelvet Work?</h3>
	<p class="my-4 text-gray-600">
		A <code class="bg-rose-100 rounded-lg p-1">Svelvet</code> flow component consists of nodes and
		edges (or just nodes). You can pass arrays of
		<code class="bg-rose-100 rounded-lg p-1">nodes</code>
		and <code class="bg-rose-100 rounded-lg p-1">edges</code> as props to the Svelvet component. All
		node and edge ids need to be unique. A node requires a position and a label and an edge requires
		a source (node id) and a target (node id).
	</p>
</div>
<div>
	<h3 class="text-xl font-semibold mt-12">Use Cases</h3>
	<p class="my-4 text-gray-600">
		There are many reasons why you may want to include a flow diagram in your application or
		website. Some of these use cases include:
	</p>
	<ul class="ml-8 text-gray-600">
		<li>User flows</li>
		<li>Project management</li>
		<li>HR organization charts</li>
		<li>Operational procedures</li>
		<li>Business planning</li>
		<li>... and so much more!</li>
	</ul>
	<p class="my-4 text-gray-600">
		Below is a quick example of using <code class="bg-rose-100 rounded-lg p-1">Svelvet</code> to display
		a diagram mapping out the purchase flow of an application.
	</p>
</div>

<iframe
	src="https://codesandbox.io/embed/core-concepts-yixl8c?autoresize=1&codemirror=1&fontsize=14&hidenavigation=1&module=%2FApp.svelte&theme=dark&view=preview"
	style="width:100%; height:600px; border:0; border-radius: 8px; overflow:hidden;"
	title="core-concepts"
	allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
	sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

<style>
	li {
		list-style-type: circle;
	}
</style>
