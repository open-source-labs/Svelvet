<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import type {
		Graph as GraphType,
		GraphKey,
		NodeProps,
		Theme,
		CSSColorString,
		EdgeStyle,
		XYPair
	} from '$lib/types';
	import { createGraph } from '$lib/utils/';
	import { graphStore } from '$lib/stores';
	import Graph from '../Graph/Graph.svelte';
	import { reloadStore } from '$lib/utils/savers/reloadStore';
	import FlowChart from '$lib/components/FlowChart/FlowChart.svelte';
	import { writable } from 'svelte/store';
	import { THEMES } from '$lib/constants/themes';

	export let mermaid = '';
	export let theme: Theme = 'light';
	export let id: number | string = 0;
	export let snapTo = 1;
	export let zoom = 1;
	export let TD = false;
	export let editable = false;
	export let locked = false;
	export let width = 0;
	export let height = 0;
	export let minimap = false;
	export let controls = false;
	export let toggle = false;
	export let fitView: boolean | 'resize' = false;
	export let selectionColor: CSSColorString = 'lightblue';
	export let edgeStyle: EdgeStyle = 'bezier';
	export let edge: ConstructorOfATypedSvelteComponent | null = null;
	export let disableSelection = false;
	export let mermaidConfig: Record<string, NodeProps> = {};
	export let translation: XYPair = { x: 0, y: 0 };

	let graph: GraphType;

	let direction: 'TD' | 'LR' = TD ? 'TD' : 'LR';

	setContext('snapTo', snapTo);
	setContext('edgeStyle', edgeStyle);
	setContext('graphEdge', edge);

	onMount(() => {
		const stateObject = localStorage.getItem('state');
		if (stateObject) {
			graph = reloadStore(stateObject);
			graphStore.add(graph, graph.id);
		} else {
			let graphKey: GraphKey = `G-${id || graphStore.count() + 1}`;

			graph = createGraph(graphKey, { zoom, theme, direction, editable, locked, translation });

			graphStore.add(graph, graphKey);
		}
	});

	let currentTheme = writable(THEMES[theme]);
	setContext('themeStore', currentTheme);

	$: if (graph) {
		$currentTheme = THEMES[theme];
	}

	$: backgroundExists = $$slots.background;

	$: if (graph) graph.transforms.scale.set(zoom);
</script>

{#if graph}
	<Graph
		{width}
		{height}
		{toggle}
		{backgroundExists}
		{minimap}
		{graph}
		{fitView}
		{controls}
		{selectionColor}
		{disableSelection}
	>
		{#if mermaid.length}
			<FlowChart {mermaid} {mermaidConfig} />
		{/if}
		<slot />
		<slot name="minimap" slot="minimap" />
		<slot name="controls" slot="controls" />
		<slot name="background" slot="background" />
		<slot name="toggle" slot="toggle" />
	</Graph>
{:else}
	<div
		style:width={width ? width + 'px' : '100%'}
		style:height={height ? height + 'px' : '100%'}
		style:background-color={THEMES[theme].map}
	/>
{/if}
