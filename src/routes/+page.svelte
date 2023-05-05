<script lang="ts">
	import { Svelvet, Node, Anchor } from '$lib';
	import { getContext } from 'svelte';
	import Connector from '../example-components/Connector.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle/ThemeToggle.svelte';
	function addAndConnect(connect: (connections: string | number) => void) {
		connect(totalNodes + 4);
		totalNodes++;
	}
	let totalNodes = 0;
	let nodeVisible = false;
</script>

<body on:keydown={() => (nodeVisible = !nodeVisible)}>
	<Svelvet snapTo={40} on:edgeDrop={(e) => console.log(e)}>
		<Connector />
		<Node bgColor="red" inputs={4} position={{ x: 600, y: 200 }} />
		<Node inputs={5} position={{ x: 600, y: 600 }} />
		{#if nodeVisible}
			<Node inputs={5} drop="cursor" />
		{/if}
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
