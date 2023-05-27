<script context="module" lang="ts">
	import Graph from '../Graph/Graph.svelte';
	import FlowChart from '$lib/components/FlowChart/FlowChart.svelte';
	import { onMount, setContext } from 'svelte';
	import { createGraph } from '$lib/utils/';
	import { graphStore } from '$lib/stores';
	import { reloadStore } from '$lib/utils/savers/reloadStore';
	import type { ComponentType } from 'svelte';
	import type { Graph as GraphType, EdgeStyle, XYPair } from '$lib/types';
	import type { NodeConfig, GraphKey, CSSColorString } from '$lib/types';
</script>

<script lang="ts">
	// Props
	export let mermaid = '';
	/**
	 * @default light
	 * @description This prop is used to interface with custom style blocks created using CSS. You can create any number of
	 * themes with the following selector `:root[svelvet-theme="your-theme"]` and then pass the name of your theme
	 * to this prop to apply it to the graph. Please see the docs for the CSS variables options. Svelvet reserves the "light" and "dark" themes for
	 * internal use.
	 */
	export let theme = 'light';
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
	export let drawer = false;
	/**
	 * @default `false`
	 * @description When `true`, the graph will automatically adjust translation
	 * and scale to fit all nodes within the viewport. When set to `resize`, this
	 * will continuously happen as the viewport changes size. This value is reactive.
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
	export let title = '';

	let graph: GraphType;
	let direction: 'TD' | 'LR' = TD ? 'TD' : 'LR';

	setContext('snapTo', snapTo);
	setContext('edgeStyle', edgeStyle);
	setContext('graphEdge', edge);
	setContext('raiseEdgesOnSelect', raiseEdgesOnSelect);
	setContext('edgesAboveNode', edgesAboveNode);

	onMount(() => {
		const stateObject = localStorage.getItem('state');
		if (stateObject) {
			graph = reloadStore(stateObject);
			graphStore.add(graph, graph.id);
		} else {
			let graphKey: GraphKey = `G-${id || graphStore.count() + 1}`;

			graph = createGraph(graphKey, { zoom, direction, editable, locked, translation });

			graphStore.add(graph, graphKey);
		}
	});

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
		{theme}
		{drawer}
		{controls}
		{selectionColor}
		{disableSelection}
		{trackpadPan}
		{modifier}
		{title}
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
		<slot name="drawer" slot="drawer" />
	</Graph>
{:else}
	<div
		class="svelvet-temp"
		style:width={width ? width + 'px' : '100%'}
		style:height={height ? height + 'px' : '100%'}
	/>
{/if}

<style>
	.svelvet-temp {
		background-color: transparent;
	}
	:root {
		--default-node-border-width: 1.5px;
		--default-node-width: 200px;
		--default-node-height: 100px;
		--default-node-border-radius: 10px;

		--default-node-cursor: grab;
		--default-background-cursor: move;

		--default-anchor-border-width: 1px;
		--default-anchor-radius: 50%;
		--default-anchor-size: 12px;

		--default-edge-width: 2px;

		--default-selection-box-border-width: 1px;

		--shadow-color: 0deg 0% 10%;
		--shadow-elevation-low: 0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.4),
			0.4px 0.8px 1px -1.2px hsl(var(--shadow-color) / 0.34),
			1px 2px 2.5px -2.5px hsl(var(--shadow-color) / 0.34);
		--shadow-elevation-medium: 0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.42),
			0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.1),
			2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.1),
			5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.1);

		--default-controls-shadow: var(--shadow-elevation-medium);
		--default-minimap-shadow: var(--shadow-elevation-medium);
		--default-theme-toggle-shadow: var(--shadow-elevation-medium);
	}

	:root {
		--default-node-color: hsl(0, 0%, 95%);
		--default-node-border-color: hsl(0, 0%, 87%);
		--default-node-selection-color: hsl(0, 0%, 13%);
		--default-text-color: hsl(0, 0%, 20%);
		--default-node-shadow: var(--shadow-elevation-medium);

		--default-background-color: hsl(0, 0%, 100%);
		--default-dot-color: hsl(0, 0%, 53%);

		--default-accent-color: hsl(0, 0%, 100%);
		--default-primary-color: hsl(0, 0%, 83%);

		--default-selection-box-color: hsl(195, 53%, 79%);

		--default-edge-color: hsl(0, 0%, 40%);
		--default-target-edge-color: hsl(0, 0%, 0%);
		--default-edge-shadow: var(--shadow-elevation-medium);
		--default-label-color: hsl(0, 0%, 95%);
		--default-label-text-color: hsl(0, 0%, 20%);

		--plugin-border: hsl(0, 0%, 42%);
		--default-controls-border: var(--plugin-border);
		--default-minimap-border: var(--plugin-border);
		--default-theme-toggle-border: var(--plugin-border);

		--default-anchor-color: hsl(0, 0%, 67%);
		--default-anchor-border-color: hsl(0, 0%, 100%);

		--default-anchor-connected: hsl(0, 0%, 40%);
		--default-anchor-connected-border: hsl(0, 0%, 95%);

		--default-anchor-connecting: hsl(0, 0%, 40%);
		--default-anchor-connecting-border: hsl(0, 0%, 100%);

		--default-anchor-hovering: hsl(0, 0%, 46%);
		--default-anchor-hovering-border: hsl(0, 0%, 0%);

		--default-minimap-background-color: hsl(0, 0%, 100%);
		--default-minimap-node-color: hsl(0, 0%, 95%);

		--default-controls-background-color: hsl(0, 0%, 100%);
		--default-controls-text-color: hsl(0, 0%, 20%);

		--default-theme-toggle-text-color: hsl(0, 0%, 20%);
		--default-theme-toggle-color: hsl(0, 0%, 100%);

		--default-drawer-button-color: hsl(0, 2%, 89%);
		--default-drawer-button-text-color: hsl(0, 0%, 20%);

		--default-drawer-reset-button-color: hsl(0, 2%, 89%);
		--default-drawer-reset-button-text-color: hsl(0, 0%, 20%);
		--default-drawer-reset-button-hover-color: hsl(0, 0%, 30%);
		--default-drawer-reset-button-hover-text-color: hsl(0, 0%, 100%);
	}

	:root[svelvet-theme='dark'] {
		--default-node-color: hsl(0, 0%, 20%);
		--default-node-border-color: hsl(0, 0%, 7%);
		--default-node-selection-color: hsl(0, 0%, 87%);
		--default-text-color: hsl(0, 0%, 100%);
		--default-node-shadow: var(--shadow-elevation-medium);

		--default-background-color: hsl(0, 0%, 27%);
		--default-dot-color: hsl(0, 0%, 60%);

		--default-accent-color: hsl(0, 0%, 7%);
		--default-primary-color: hsl(0, 0%, 66%);

		--default-selection-box-color: hsl(195, 53%, 79%);

		--default-edge-color: hsl(0, 0%, 100%);
		--default-target-edge-color: hsl(0, 0%, 0%);
		--default-edge-shadow: var(--shadow-elevation-medium);
		--default-label-color: hsl(0, 0%, 20%);
		--default-label-text-color: hsl(0, 0%, 100%);

		--default-anchor-color: hsl(0, 0%, 67%);
		--default-anchor-border-color: hsl(0, 0%, 87%);
		--default-anchor-connected: hsl(0, 0%, 100%);
		--default-anchor-connected-border: hsl(0, 0%, 20%);

		--default-anchor-connecting: hsl(0, 0%, 40%);
		--default-anchor-connecting-border: hsl(0, 0%, 100%);

		--default-anchor-hovering: hsl(0, 0%, 46%);
		--default-anchor-hovering-border: hsl(0, 0%, 0%);

		--plugin-border: hsl(0, 0%, 42%);
		--default-controls-border: var(--plugin-border);
		--default-minimap-border: var(--plugin-border);
		--default-theme-toggle-border: var(--plugin-border);

		--default-minimap-background-color: hsl(0, 0%, 27%);

		--default-minimap-node-color: hsl(0, 0%, 20%);

		--default-controls-background-color: hsl(0, 0%, 27%);
		--default-controls-text-color: hsl(0, 0%, 100%);

		--default-theme-toggle-text-color: hsl(0, 0%, 100%);
		--default-theme-toggle-color: hsl(0, 0%, 27%);

		--default-drawer-button-color: hsl(0, 0%, 19%);
		--default-drawer-button-text-color: hsl(0, 0%, 100%);
		

		--default-drawer-reset-button-color: hsl(0, 0%, 19%);
		--default-drawer-reset-button-text-color: hsl(0, 0%, 89%);
		--default-drawer-reset-button-hover-color: hsl(0, 0%, 59%);
		--default-drawer-reset-button-hover-text-color: hsl(0, 0%, 100%);
		
	}

	:root[svelvet-theme='light'] {
		--default-node-color: hsl(0, 0%, 95%);
		--default-node-border-color: hsl(0, 0%, 87%);
		--default-node-selection-color: hsl(0, 0%, 13%);
		--default-text-color: hsl(0, 0%, 20%);
		--default-node-shadow: var(--shadow-elevation-medium);

		--default-background-color: hsl(0, 0%, 100%);
		--default-dot-color: hsl(0, 0%, 53%);

		--default-accent-color: hsl(0, 0%, 100%);
		--default-primary-color: hsl(0, 0%, 83%);

		--default-selection-box-color: hsl(195, 53%, 79%);

		--default-edge-color: hsl(0, 0%, 40%);
		--default-target-edge-color: hsl(0, 0%, 0%);
		--default-edge-shadow: var(--shadow-elevation-medium);
		--default-label-color: hsl(0, 0%, 95%);
		--default-label-text-color: hsl(0, 0%, 20%);

		--plugin-border: hsl(0, 0%, 42%);
		--default-controls-border: var(--plugin-border);
		--default-minimap-border: var(--plugin-border);
		--default-theme-toggle-border: var(--plugin-border);

		--default-anchor-color: hsl(0, 0%, 67%);
		--default-anchor-border-color: hsl(0, 0%, 100%);

		--default-anchor-connected: hsl(0, 0%, 40%);
		--default-anchor-connected-border: hsl(0, 0%, 95%);

		--default-anchor-connecting: hsl(0, 0%, 40%);
		--default-anchor-connecting-border: hsl(0, 0%, 100%);

		--default-anchor-hovering: hsl(0, 0%, 46%);
		--default-anchor-hovering-border: hsl(0, 0%, 0%);

		--default-minimap-background-color: hsl(0, 0%, 100%);
		--default-minimap-node-color: hsl(0, 0%, 95%);

		--default-controls-background-color: hsl(0, 0%, 100%);
		--default-controls-text-color: hsl(0, 0%, 20%);

		--default-theme-toggle-text-color: hsl(0, 0%, 20%);
		--default-theme-toggle-color: hsl(0, 0%, 100%);

		--default-drawer-button-color: hsl(0, 2%, 89%);
		--default-drawer-button-text-color: hsl(0, 0%, 20%);
		
		--default-drawer-reset-button-color: hsl(0, 2%, 89%);
		--default-drawer-reset-button-text-color: hsl(0, 0%, 20%);
		--default-drawer-reset-button-hover-color: hsl(0, 0%, 30%);
		--default-drawer-reset-button-hover-text-color: hsl(0, 0%, 100%);
	}
</style>
