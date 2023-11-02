<script lang="ts">
	import { Svelvet, Node, Anchor, Resizer } from '$lib';
	import Connector from '../example-components/Connector.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle/ThemeToggle.svelte';
	import TextField from '$lib/components/data/TextField/TextField.svelte';
	import Controls from '$lib/components/Controls/Controls.svelte';
	function addAndConnect(connect: (connections: string | number) => void) {
		connect(totalNodes + 4);
		totalNodes++;
	}
	let totalNodes = 0;
	let widthCount = 1;
</script>

<body>
	<Svelvet minimap title="test" controls>
		<Connector />
		<Node bgColor="red" inputs={4} position={{ x: 600, y: 200 }}>
			<button on:click={() => widthCount++} />
			{#each { length: widthCount } as item}
				<div>Height</div>
			{/each}
		</Node>
		<Node inputs={5} position={{ x: 600, y: 600 }}>
			<TextField placeholder="name" />
		</Node>
		<Node let:selected dimensions={{ width: 400, height: 100 }}>
			<div class="node" class:selected>
				<Resizer width height rotation />
			</div>
		</Node>
		<Node useDefaults dimensions={{ width: 400, height: 300 }} position={{ x: 100, y: 300 }}>
			<div class="anchor">
				<Anchor nodeConnect />
			</div>
			<Anchor nodeConnect />
		</Node>
		{#each { length: totalNodes } as node}
			<Node let:connect useDefaults position={{ x: Math.random() * 200, y: Math.random() * 400 }} />
		{/each}
		<ThemeToggle slot="toggle" />
	</Svelvet>
</body>

<style>
	.node {
		width: 100%;
		height: 100%;
		background-color: aqua;
		border: 2px solid black;
	}
	.anchor {
		position: absolute;
		right: 10px;
	}
	body {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
	}
	:root[theme='dark'] {
		--background-color: black;
		--node-color: white;
	}
	:root[theme='light'] {
		--background-color: purple;
		--node-color: green;
	}
</style>
