<script>
	import GraphView from '$lib/Containers/GraphView/index.svelte';
	import InputNode from '$lib/Nodes/InputNode/index.svelte';
	import OutputNode from '$lib/Nodes/OutputNode/index.svelte';
	import DefaultNode from '$lib/Nodes/DefaultNode/index.svelte';
	// import StraightEdge from '$lib/Edges/StraightEdge/index.svelte';
	// import BasicEdge from '$lib/Edges/BasicEdge/index.svelte';

	export let nodes;
</script>

<GraphView>
	{#each nodes as node}
		{#if node.type === 'input'}
			<InputNode {node}>{node.data.label}</InputNode>
		{:else if node.type === 'output'}
			<OutputNode {node}>{node.data.label}</OutputNode>
		{:else if node.type === 'default'}
			<DefaultNode {node}>{node.data.label}</DefaultNode>
		{/if}
	{/each}
	<!-- <StraightEdge /> -->
	<!-- <BasicEdge /> -->
</GraphView>
