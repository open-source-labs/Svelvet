<script lang="ts">
	import { Svelvet, Node, Anchor, Resizer } from '$lib';
	import Connector from '../example-components/Connector.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle/ThemeToggle.svelte';
	import TextField from '$lib/components/data/TextField/TextField.svelte';
	// Controls is not used on the canvas itself, but is part of the HUD of the dev homepage
	// maybe not needed here
	import Controls from '$lib/components/Controls/Controls.svelte';
	// added getJSONState function
	import { getJSONState } from '$lib/utils/savers/saveStore';
	// added Graph interface import
	import type { Graph } from '$lib/types';
	// added getContext import
	import { getContext } from 'svelte';
	// added graphStore import
	import { graphStore } from '$lib/stores';
	function addAndConnect(connect: (connections: string | number) => void) {
		connect(totalNodes + 4);
		totalNodes++;
	}
	let totalNodes = 0;
	let widthCount = 1;
	let graph: any;
	graphStore.subscribe((graphMap) => {
		// Assuming you want to log the graph with a specific key
		// This key should be known or determined based on your application logic
		const graphKey = 'G-1'; // Example key
		graph = graphMap.get(graphKey);
	});
	function logCurrentGraphState() {
		if (graph) {
			console.log('Current Graph State:', graph);
		} else {
			console.log('No current graph found');
		}
	}
</script>

<body>
	<button on:click={() => alert('hi')}>ALERTe</button>
	<Svelvet minimap title="test" controls>
		<!-- buttons on lower level node -->
		<Connector />
		<button on:click={() => alert('hi')}>ALERTe</button>
		<Node bgColor="red" inputs={4} position={{ x: 600, y: 200 }}>
			<button on:click={() => widthCount++} />
			{#each { length: widthCount } as item}
				<div>Height</div>
			{/each}
			<!-- <button on:click={() => alert('hi')}>ALERTe</button> -->
			<button
				style="cursor: pointer;"
				on:click={() => {
					// const graph = getContext('graph');
					console.log('Graph on user interaction:', graph);
					getJSONState(graph);
				}}>SAVE STATE</button
			>
			<button on:click={logCurrentGraphState}>Log Current Graph State</button>
		</Node>
		<!-- text field -->
		<Node inputs={5} position={{ x: 600, y: 600 }}>
			<TextField placeholder="name" />
		</Node>
		<!-- blue node -->
		<Node let:selected dimensions={{ width: 400, height: 100 }}>
			<div class="node" class:selected>
				<Resizer width height rotation />
			</div>
		</Node>
		<!-- top gray node -->
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
