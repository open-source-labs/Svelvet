<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import type {
		Graph as GraphType,
		GraphKey,
		NodeConfig,
		ThemeGroup,
		CSSColorString,
		EdgeStyle,
		XYPair,
		Theme
	} from '$lib/types';

	import { createGraph } from '$lib/utils/';
	import { graphStore } from '$lib/stores';
	import Graph from '../Graph/Graph.svelte';
	import { reloadStore } from '$lib/utils/savers/reloadStore';
	import FlowChart from '$lib/components/FlowChart/FlowChart.svelte';
	import { writable, type Writable } from 'svelte/store';
	import { THEMES } from '$lib/constants/themes';
	import type { ComponentType } from 'svelte';

	export let mermaid = '';
	export let theme: Writable<ThemeGroup> | Theme = 'dark';
	export let altTheme: ThemeGroup | Theme = 'light';
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
	export let edge: ComponentType | null = null;
	export let disableSelection = false;
	export let mermaidConfig: Record<string, NodeConfig> = {};
	export let translation: XYPair = { x: 0, y: 0 };
	export let trackpadPan = false;
	export let modifier: 'alt' | 'ctrl' | 'shift' | 'meta' = 'meta';

	let graph: GraphType;
	let currentTheme: Writable<ThemeGroup> =
		typeof theme === 'string' ? writable(THEMES[theme]) : theme;

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

			graph = createGraph(graphKey, {
				zoom,
				theme: $currentTheme,
				direction,
				editable,
				locked,
				translation
			});

			graphStore.add(graph, graphKey);
		}
	});

	setContext('themeStore', currentTheme);
	setContext('altTheme', typeof altTheme === 'string' ? THEMES[altTheme] : altTheme);

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
		{trackpadPan}
		{modifier}
		on:edgeDrop
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
		style:background-color={$currentTheme.map}
	/>
{/if}
