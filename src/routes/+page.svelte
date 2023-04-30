<script lang="ts">
	import { Svelvet, Node, Anchor } from '$lib';
	import { getContext } from 'svelte';
	import Connector from '../example-components/Connector.svelte';
	function addAndConnect(connect: (connections: string | number) => void) {
		connect(totalNodes + 4);
		totalNodes++;
	}
	let totalNodes = 0;
</script>

<body>
	<Svelvet snapTo={40}>
		<Connector />
		<Node inputs={4} position={{ x: 600, y: 200 }} />
		<Node inputs={5} position={{ x: 600, y: 600 }} />
		<Node useDefaults dimensions={{ width: 400, height: 300 }} position={{ x: 100, y: 300 }}>
			<Anchor invisible />
		</Node>
		{#each { length: totalNodes } as node}
			<Node let:connect useDefaults position={{ x: Math.random() * 200, y: Math.random() * 400 }} />
		{/each}
	</Svelvet>
</body>

<style>
	body {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
	}
</style>
