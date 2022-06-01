<script>
	import copyIcon from '../../assets/clipboard.svg';
	const copyNPM = () => navigator.clipboard.writeText('npm install svelvet');
	const copyYarn = () => navigator.clipboard.writeText('yarn add svelvet');
</script>

<div class="overflow-x-hidden">
	<h2 class="text-4xl font-semibold mb-8 w-screen">Installation</h2>
	<p class="my-4 text-gray-600">
		Svelvet is available as an <a
			class="text-rose-600 underline underline-offset-1"
			target="_blank"
			href="https://www.npmjs.com/package/svelvet">npm package</a
		>.
	</p>
	<h3 class="text-xl font-semibold">npm</h3>
	<p class="my-4 text-gray-600">
		To install and save in your <code class="bg-rose-100 rounded-lg p-1">package.json</code>
		dependencies, run the command below using
		<strong>npm</strong>:
	</p>

	<div class="flex">
		<code class="block rounded-md p-3 bg-rose-100 text-rose-600 w-3/4 md:w-1/2"
			><span class="text-rose-800">npm install</span> svelvet
		</code>
		<img
			on:click={copyNPM}
			src={copyIcon}
			alt="clipboard icon"
			class="rounded-md p-3 bg-rose-100 -ml-4 cursor-pointer"
		/>
	</div>
</div>
<div>
	<p class="my-4 text-gray-700">
		Or
		<strong>yarn</strong>:
	</p>

	<div class="flex">
		<code class="block rounded-md p-3 bg-rose-100 text-rose-600 w-3/4 md:w-1/2"
			><span class="text-rose-800">yarn add</span> svelvet
		</code>
		<img
			on:click={copyYarn}
			src={copyIcon}
			alt="clipboard icon"
			class="rounded-md p-3 bg-rose-100 -ml-4 cursor-pointer"
		/>
	</div>
	<p class="my-4 text-gray-600">
		After you've installed Svelvet, head over to <a
			class="text-rose-600 underline underline-offset-1"
			href="/docs/basic-usage">Basic Usage</a
		> to see how to render the component.
	</p>
</div>
<div>
	<h3 class="text-xl font-semibold mt-12">Terms</h3>
	<p class="my-4 text-gray-600">
		Throughout the documentation we use the following terms for parts of a Svelvet flow diagram:
	</p>
	<p class="my-4 ml-4 text-gray-600">
		<strong>Node:</strong> A node is a draggable element that can be connected to other nodes.
		<br />
		<strong>Edge:</strong> An edge is the connecting line between two nodes.
	</p>
</div>
