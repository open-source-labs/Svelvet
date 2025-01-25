<!-- @migration-task Error while migrating Svelte code: Unexpected token
https://svelte.dev/e/js_parse_error -->
<script lang="ts">
	import { Svelvet, Node, Anchor, Resizer, Group } from '$lib';
	import Connector from '../example-components/Connector.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle/ThemeToggle.svelte';
	import TextField from '$lib/components/data/TextField/TextField.svelte';
	import Controls from '$lib/components/Controls/Controls.svelte';
	import Drawer from '$lib/components/Drawer/Drawer.svelte';
	import CircleColor from '../example-components/sandbox/CircleColor.svelte';
	import DashCount from '../example-components/sandbox/DashCount.svelte';
	import Noise from '../example-components/sandbox/Noise.svelte';
	import Scale from '../example-components/sandbox/Scale.svelte';
	import Thickness from '../example-components/sandbox/Thickness.svelte';
	import Output from '../example-components/sandbox/Output.svelte';
	import { getJSONState } from '$lib/utils/savers/saveStore';
	import type { Graph } from '$lib/types';
	import { getContext } from 'svelte';
	import { graphStore } from '$lib/stores';
	import ContrastTheme from '$lib/components/ContrastTheme/ContrastTheme.svelte';
	import { get } from 'svelte/store';

	function addAndConnect(connect: (connections: string | number) => void) {
		connect(totalNodes + 4);
		$state.totalNodes++;
	}

	$state = {
		totalNodes: 0,
		widthCount: 1,
		graph: null
	};

	graphStore.subscribe((graphMap) => {
		const graphKey = 'G-1';
		$state.graph = graphMap.get(graphKey);
	});

	function logCurrentGraphState() {
		const currentGraphMap = get(graphStore);
		const graph = currentGraphMap.get('G-1');
		if (graph) {
			console.log('Current Graph State:', graph);
		} else {
			console.log('No current graph found');
		}
	}
</script>

<body>
	<Svelvet minimap title="test" controls>
		{@render Connector /}
		<Node bgColor="red" inputs={4} position={{ x: 600, y: 200 }}>
			<button onclick={() => $state.widthCount++} />
			{#each { length: $state.widthCount } as item}
				<div>Height</div>
			{/each}
			<button
				style="cursor: pointer;"
				onclick={() => {
					console.log('Graph on user interaction:', $state.graph);
					getJSONState($state.graph);
				}}>SAVE STATE</button
			>
			<button onclick={logCurrentGraphState}>Log Current Graph State</button>
		</Node>
		<Node inputs={5} position={{ x: 600, y: 600 }}>
			{@render TextField placeholder="name" /}
		</Node>
		<Node $props={{ selected }} dimensions={{ width: 400, height: 100 }}>
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
		{#each { length: $state.totalNodes } as node}
			<Node $props={{ connect }} useDefaults position={{ x: Math.random() * 200, y: Math.random() * 400 }} />
		{/each}
		<ThemeToggle slot="toggle" />
		{@render ContrastTheme slot="contrast" /}
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
