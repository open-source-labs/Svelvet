<script lang="ts">
	import { Svelvet, Node, Anchor } from '$lib';
	import Connector from '../../example-components/Connector.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle/ThemeToggle.svelte';

	import { get } from 'svelte/store'

	function addAndConnect(connect: (connections: string | number) => void) {
		connect(totalNodes + 4);
		totalNodes++;
	}
	let totalNodes = 0;
	let widthCount = 1;

	function nodeClicked(e: CustomEvent) {
		console.log(e.type);
	}

	function nodeReleased(e: CustomEvent) {
		console.log(e.type);
		console.log("moved: ", get(e.detail.node.moved));
	}

</script>

<body>
	<Svelvet minimap title="test">
		<Connector />
		<Node bgColor="red" inputs={4} position={{ x: 600, y: 200 }}>
			<button on:click={() => widthCount++} />
			{#each { length: widthCount } as item}
				<div>Height</div>
			{/each}
		</Node>
		<Node inputs={5} position={{ x: 600, y: 600 }} on:nodeClicked="{nodeClicked}" on:nodeReleased="{nodeReleased}" />
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
