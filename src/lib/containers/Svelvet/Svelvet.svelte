<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import type {
		Graph as GraphType,
		GraphKey,
		NodeConfig,
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
	import type { ComponentType } from 'svelte';

	export let mermaid = '';
	export let theme: Theme = 'light';
	export let id: number | string = 0;
	export let snapTo = 0;
	/**
	 * @default 1
	 * @description Sets initial zoom level of the graph. This value
	 * features two way binding, so changing it will update the zoom.
	 */
	export let zoom = 1;
	export let TD = false;
	export let editable = false;
	export let locked = false;
	export let width = 0;
	export let height = 0;
	export let minimap = false;
	export let controls = false;
	export let toggle = false;
	/**
	 * @default `false`
	 * @description When `true`, the graph will automatically adjust translation
	 * and scale to fit all nodes with inthe viewport. When set to `resize`, this
	 * will continuously happen as the viewport changes size.
	 */
	export let fitView: boolean | 'resize' = false;
	/**
	 * @default 'lightblue'
	 * @description Color of the box used to select/group nodes
	 */
	export let selectionColor: CSSColorString = 'lightblue';
	export let edgeStyle: EdgeStyle = 'bezier';
	export let edge: ComponentType | null = null;
	/**
	 * @default false
	 * @description Boolean controlling whether or not Shift + Click enables the selection of multiple components.
	 * This feature is enabled by default.
	 */
	export let disableSelection = false;
	export let mermaidConfig: Record<string, NodeConfig> = {};
	/**
	 * @default { x: 0, y: 0 }
	 * @type { x: number, y: number }
	 * @description The initial translation of the graph. This value
	 * does not currently feature two way binding
	 */
	export let translation: XYPair = { x: 0, y: 0 };
	export let trackpadPan = false;
	export let modifier: 'alt' | 'ctrl' | 'shift' | 'meta' = 'meta';
	/**
	 * @default false
	 * @description When a Node is selected, this prop controls whether the
	 * z-index of a connected edge should be raised.
	 * Setting to `true` raises the edge regardless of
	 * if the source or target is selected.
	 */
	export let raiseEdgesOnSelect: boolean | 'source' | 'target' = false;
	/**
	 * @default false
	 * @description Sets whether edges should, by default,
	 * be placed above or below connected Nodes. Can be set
	 * to `all` to force Edges above all nodes. Otherwise,
	 * true essentially turns on `raiseEdgesOnSelect`, but places the
	 * edges at higher z-Index than the Node.
	 */
	export let edgesAboveNode: boolean | 'all' = false;

	setContext('raiseEdgesOnSelect', raiseEdgesOnSelect);
	setContext('edgesAboveNode', edgesAboveNode);
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
		style:background-color={THEMES[theme].map}
	/>
{/if}
