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
	<h3 class="text-xl font-semibold mt-12">Quick Start</h3>
	<p class="my-4 text-gray-600">
		Here's a quick example to get you started. Two arrays and the <code
			class="bg-rose-100 rounded-lg p-1">Svelvet</code
		> component are all you need! Simply alter the node and edge properties to your liking.
	</p>
</div>
<iframe
	src="https://codesandbox.io/embed/quick-start-71vweu?autoresize=1&codemirror=1&fontsize=14&hidenavigation=1&module=%2FApp.svelte&theme=light&view=split"
	style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
	title="quick-start"
	allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
	sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
	class="my-4"
/>
