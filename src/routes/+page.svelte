<script lang="ts">
	import { Svelvet, Node, type ThemeGroup } from '$lib';
	import CustomNode from '../example-components/CustomNode.svelte';
	import CustomEdge from '../example-components/CustomEdge.svelte';
	import InputNode from '../example-components/InputNode.svelte';
	import { readable, writable } from 'svelte/store';
	import { setContext } from 'svelte';
	let customNodeCount = writable(1);
	let thisNodeCount = writable(3);
	setContext('customNodeCount', customNodeCount);

	const customTheme = writable(<ThemeGroup>{
		node: '#AED6F1',
		map: '#5DADE2',
		border: '#2874A6',
		text: '#1F618D',
		selection: '#5499C7',
		header: '#3498DB',
		edge: 'white',
		anchor: '#85C1E9',
		controls: '#1B4F72',
		dots: '#2D9743',
		alt: '#5DADE2'
	});
</script>

<body>
	<Svelvet edgeStyle="step" edge={CustomEdge} TD zoom={0.6} minimap toggle>
		{#each { length: $customNodeCount } as _, i}
			<CustomNode />
		{/each}

		{#each { length: $thisNodeCount } as _, i}
			<Node on:duplicate={() => $thisNodeCount++} />
		{/each}
	</Svelvet>
</body>

<style>
	body {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: gray;
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
	}
</style>
