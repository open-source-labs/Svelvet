<script lang="ts">
	import { Svelvet, Node } from '$lib';
	import CustomNode from '../example-components/CustomNode.svelte';
	import CustomEdge from '../example-components/CustomEdge.svelte';
	import InputNode from '../example-components/InputNode.svelte';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	let customNodeCount = writable(1);
	let thisNodeCount = writable(3);
	setContext('customNodeCount', customNodeCount);
</script>

<body>
	<Svelvet edgeStyle="step" edge={CustomEdge} TD theme="dark" zoom={0.6} minimap>
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
