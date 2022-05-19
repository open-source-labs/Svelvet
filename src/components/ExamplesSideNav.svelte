<script lang="ts">
	const nodesLinks = [
		['DefaultNode', 'examples/default-node'],
		['InputNode', 'examples/input-node'],
		['OutputNode', 'examples/output-node'],
		['CustomNode', 'examples/custom-node']
	];
	const edgesLinks = [
		['DefaultEdge', 'examples/default-edge'],
		['SimpleBezierEdge', 'examples/simple-bezier-edge'],
		['StepEdge', 'examples/step-edge'],
		['CustomEdge', 'examples/custom-edge']
	];

	let activeLink = 'basicUsage';

	const setActiveLink = (e: MouseEvent) => {
		if (e.target.id) activeLink = e.target.id;
	};
</script>

<div class="flex flex-col my-5 text-sm">
	<a
		href="/examples"
		class="font-medium text-gray-700 leading-9 border-l px-4 hover:border-rose-300 {activeLink ===
		'basicUsage'
			? 'text-rose-500 hover:text-rose-500 border-rose-300'
			: 'hover:text-gray-700 border-gray-100'}">Basic Usage</a
	>
</div>
<div class="flex flex-col my-5 text-sm">
	<p class="font-medium text-gray-700 leading-9">Nodes</p>
	<div class="flex flex-col leading-9 text-gray-500 ">
		{#each nodesLinks as link}
			<a
				on:click={setActiveLink}
				id={link[0]}
				href={link[1]}
				class="border-l px-4 hover:border-rose-300  {activeLink === link[0]
					? 'text-rose-500 hover:text-rose-500 border-rose-300'
					: 'hover:text-gray-700 border-gray-100'}">{link[0]}</a
			>
		{/each}
	</div>
</div>
<div class="flex flex-col my-5 text-sm">
	<p class="font-medium text-gray-700 leading-9">Edges</p>
	<div class="flex flex-col leading-9 text-gray-500 ">
		{#each edgesLinks as link}
			<a
				on:click={setActiveLink}
				id={link[0]}
				href={link[1]}
				class="border-l px-4 hover:border-rose-300  {activeLink === link[0]
					? 'text-rose-500 hover:text-rose-500 border-rose-300'
					: 'hover:text-gray-700 border-gray-100'}">{link[0]}</a
			>
		{/each}
	</div>
</div>

<style>
</style>
