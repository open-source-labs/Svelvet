<script context="module" lang="ts">
	import Graph from '../Graph/Graph.svelte';
	import FlowChart from '$lib/components/FlowChart/FlowChart.svelte';
	import { createEventDispatcher, onMount, setContext } from 'svelte';
	import { createGraph } from '$lib/utils/';
	import { graphStore } from '$lib/stores';
	import { reloadStore } from '$lib/utils/savers/reloadStore';
	import type { ComponentType } from 'svelte';
	import type {
		Graph as GraphType,
		EdgeStyle,
		EndStyle,
		XYPair,
		SvelvetConnectionEvent
	} from '$lib/types';
	import type { NodeConfig, GraphKey, CSSColorString, NodeKey } from '$lib/types';
	import type { Node, Anchor } from '$lib/types';
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
	export let editable = true;
	export let locked = false;
	export let width = 0;
	export let height = 0;
	export let minimap = false;
	export let controls = false;
	export let toggle = false;
	export let drawer = false;
	export let contrast = false;
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
	export let endStyles: Array<EndStyle> = [null, null];
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
	/**
	 * @default false
	 * @description Prevents the graph scale/zoom from changing.
	 */
	export let fixedZoom = false;
	/**
	 * @default true
	 * @description Prevents the graph from panning on click if false
	 */
	export let pannable = true;

	const dispatch = createEventDispatcher<{
		connection: SvelvetConnectionEvent;
		disconnection: SvelvetConnectionEvent;
	}>();

	// let graph: GraphType;
	let graph: GraphType | null = null;
	let direction: 'TD' | 'LR' = TD ? 'TD' : 'LR';

	setContext('snapTo', snapTo);
	setContext('edgeStyle', edgeStyle);
	setContext('endStyles', endStyles);
	setContext('graphEdge', edge);
	setContext('raiseEdgesOnSelect', raiseEdgesOnSelect);
	setContext('edgesAboveNode', edgesAboveNode);
	setContext('graph', graph);

	// function to load a graph from local storage
	// occurs after Svelvet renders
	// updated by team v.11.0
	onMount(() => {
		const stateObject = localStorage.getItem('state');
		console.log('stateObject during onMount:', stateObject); // Aqui esta confirmado que localStorage.getItem('state') esta trayendo el grafico "PERFECTAMENTE BIEN" desde el localStorage
		if (stateObject) {
			graph = reloadStore(stateObject);
			console.log('Este es el graph seteado mediante reloadStore(stateObject)', graph);
			graphStore.add(graph, graph.id); //ERRROR: graphStore no se esta actuaklzando
			console.log('graphStore actualizado', graph);
		} else {
			let graphKey: GraphKey = `G-${id || graphStore.count() + 1}`;
			graph = createGraph(graphKey, { zoom, direction, editable, locked, translation });
			graphStore.add(graph, graphKey);
		}
	});

	$: backgroundExists = $$slots.background;

	$: edgeStore = graph && graph.edges;

	$: if (graph) graph.transforms.scale.set(zoom);

	$: if (edgeStore) {
		edgeStore.onEdgeChange((edge, type) => {
			dispatch(type, {
				sourceAnchor: edge.source as Anchor,
				targetAnchor: edge.target as Anchor,
				sourceNode: edge.source.node as Node,
				targetNode: edge.target.node as Node
			});
		});
	}

	/**
	 * @description Disconnects two nodes
	 * @param source
	 * @param target
	 */
	// Need to rethink this implementation
	export function disconnect(
		source: [string | number, string | number],
		target: [string | number, string | number]
	) {
		const sourceNodeKey: NodeKey = `N-${source[0]}`;
		const sourceNode = graph.nodes.get(sourceNodeKey);
		if (!sourceNode) return;
		const sourceAnchor = sourceNode.anchors.get(`A-${source[1]}/N-${source[0]}`);
		if (!sourceAnchor) return;
		const targetNodeKey: NodeKey = `N-${target[0]}`;
		const targetNode = graph.nodes.get(targetNodeKey);
		if (!targetNode) return;
		const targetAnchor = targetNode.anchors.get(`A-${target[1]}/N-${target[0]}`);
		if (!targetAnchor) return;
		const edgeKey = graph.edges.match(sourceAnchor, targetAnchor);
		if (!edgeKey) return;
		graph.edges.delete(edgeKey[0]);
	}
</script>

<!-- Aqui se renderiza el grafico -->
{#if graph}
	<Graph
		{width}
		{height}
		{toggle}
		{backgroundExists}
		{minimap}
		{graph}
		{fitView}
		{fixedZoom}
		{pannable}
		{theme}
		{drawer}
		{controls}
		{selectionColor}
		{disableSelection}
		{trackpadPan}
		{modifier}
		{title}
		{contrast}
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
		<slot name="contrast" slot="contrast" />
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
		--default-node-cursor-blocked: not-allowed;
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
	:root[svelvet-theme='Black/White'] {
		--default-node-color: #ffffff;
		--default-node-border-color: #ffffff;
		--default-node-selection-color: #000000;
		--default-text-color: #000000;
		--default-node-shadow: var(--shadow-elevation-medium);

		--default-background-color: #000000;
		--default-dot-color: #ffffff;

		--default-accent-color: #000000;
		--default-primary-color: #ffffff;

		--default-selection-box-color: #ffffff;

		--default-edge-color: #ffffff;
		--default-target-edge-color: #000000;
		--default-edge-shadow: var(--shadow-elevation-medium);
		--default-label-color: #ffffff;
		--default-label-text-color: #000000;

		--plugin-border: #ffffff;
		--default-controls-border: var(--plugin-border);
		--default-minimap-border: var(--plugin-border);
		--default-theme-toggle-border: var(--plugin-border);

		--default-anchor-color: #ffffff;
		--default-anchor-border-color: #000000;

		--default-anchor-connected: #ffffff;
		--default-anchor-connected-border: #000000;

		--default-anchor-connecting: #ffffff;
		--default-anchor-connecting-border: #000000;

		--default-anchor-hovering: #ffffff;
		--default-anchor-hovering-border: #000000;

		--default-minimap-background-color: #000000;
		--default-minimap-node-color: #ffffff;

		--default-controls-background-color: #000000;
		--default-controls-text-color: #ffffff;

		--default-theme-toggle-text-color: #ffffff;
		--default-theme-toggle-color: #000000;

		--default-drawer-button-color: #ffffff;
		--default-drawer-button-text-color: #000000;

		--default-drawer-reset-button-color: #ffffff;
		--default-drawer-reset-button-text-color: #000000;
		--default-drawer-reset-button-hover-color: #e0e0e0;
		--default-drawer-reset-button-hover-text-color: #000000;
	}

	:root[svelvet-theme='Yellow/Black'] {
		--default-node-color: #ffff00;
		--default-node-border-color: #000000;
		--default-node-selection-color: #000000;
		--default-text-color: #000000;
		--default-node-shadow: var(--shadow-elevation-medium);

		--default-background-color: #ffff00;
		--default-dot-color: #000000;

		--default-accent-color: #000000;
		--default-primary-color: #ffff00;

		--default-selection-box-color: #000000;

		--default-edge-color: #000000;
		--default-target-edge-color: #ffff00;
		--default-edge-shadow: var(--shadow-elevation-medium);
		--default-label-color: #000000;
		--default-label-text-color: #ffff00;

		--plugin-border: #000000;
		--default-controls-border: var(--plugin-border);
		--default-minimap-border: var(--plugin-border);
		--default-theme-toggle-border: var(--plugin-border);

		--default-anchor-color: #ffff00;
		--default-anchor-border-color: #000000;

		--default-anchor-connected: #ffff00;
		--default-anchor-connected-border: #000000;

		--default-anchor-connecting: #ffff00;
		--default-anchor-connecting-border: #000000;

		--default-anchor-hovering: #ffff00;
		--default-anchor-hovering-border: #000000;

		--default-minimap-background-color: #ffff00;
		--default-minimap-node-color: #000000;

		--default-controls-background-color: #ffff00;
		--default-controls-text-color: #000000;

		--default-theme-toggle-text-color: #000000;
		--default-theme-toggle-color: #ffff00;

		--default-drawer-button-color: #ffff00;
		--default-drawer-button-text-color: #000000;

		--default-drawer-reset-button-color: #ffff00;
		--default-drawer-reset-button-text-color: #000000;
		--default-drawer-reset-button-hover-color: #000000;
		--default-drawer-reset-button-hover-text-color: #ffff00;
	}

	:root[svelvet-theme='Black/Yellow'] {
		--default-node-color: #000000;
		--default-node-border-color: #ffff00;
		--default-node-selection-color: #ffff00;
		--default-text-color: #ffff00;
		--default-node-shadow: var(--shadow-elevation-medium);

		--default-background-color: #000000;
		--default-dot-color: #ffff00;

		--default-accent-color: #ffff00;
		--default-primary-color: #000000;

		--default-selection-box-color: #ffff00;

		--default-edge-color: #ffff00;
		--default-target-edge-color: #000000;
		--default-edge-shadow: var(--shadow-elevation-medium);
		--default-label-color: #ffff00;
		--default-label-text-color: #000000;

		--plugin-border: #ffff00;
		--default-controls-border: var(--plugin-border);
		--default-minimap-border: var(--plugin-border);
		--default-theme-toggle-border: var(--plugin-border);

		--default-anchor-color: #ffff00;
		--default-anchor-border-color: #000000;

		--default-anchor-connected: #ffff00;
		--default-anchor-connected-border: #000000;

		--default-anchor-connecting: #ffff00;
		--default-anchor-connecting-border: #000000;

		--default-anchor-hovering: #ffff00;
		--default-anchor-hovering-border: #000000;

		--default-minimap-background-color: #000000;
		--default-minimap-node-color: #ffff00;

		--default-controls-background-color: #000000;
		--default-controls-text-color: #ffff00;

		--default-theme-toggle-text-color: #ffff00;
		--default-theme-toggle-color: #000000;

		--default-drawer-button-color: #000000;
		--default-drawer-button-text-color: #ffff00;

		--default-drawer-reset-button-color: #000000;
		--default-drawer-reset-button-text-color: #ffff00;
		--default-drawer-reset-button-hover-color: #ffff00;
		--default-drawer-reset-button-hover-text-color: #000000;
	}

	:root[svelvet-theme='Black/Green'] {
		--default-node-color: #000000;
		--default-node-border-color: #00ff00;
		--default-node-selection-color: #00ff00;
		--default-text-color: #00ff00;
		--default-node-shadow: var(--shadow-elevation-medium);

		--default-background-color: #000000;
		--default-dot-color: #00ff00;

		--default-accent-color: #00ff00;
		--default-primary-color: #000000;

		--default-selection-box-color: #00ff00;

		--default-edge-color: #00ff00;
		--default-target-edge-color: #000000;
		--default-edge-shadow: var(--shadow-elevation-medium);
		--default-label-color: #00ff00;
		--default-label-text-color: #000000;

		--plugin-border: #00ff00;
		--default-controls-border: var(--plugin-border);
		--default-minimap-border: var(--plugin-border);
		--default-theme-toggle-border: var(--plugin-border);

		--default-anchor-color: #00ff00;
		--default-anchor-border-color: #000000;

		--default-anchor-connected: #00ff00;
		--default-anchor-connected-border: #000000;

		--default-anchor-connecting: #00ff00;
		--default-anchor-connecting-border: #000000;

		--default-anchor-hovering: #00ff00;
		--default-anchor-hovering-border: #000000;

		--default-minimap-background-color: #000000;
		--default-minimap-node-color: #00ff00;

		--default-controls-background-color: #000000;
		--default-controls-text-color: #00ff00;

		--default-theme-toggle-text-color: #00ff00;
		--default-theme-toggle-color: #000000;

		--default-drawer-button-color: #000000;
		--default-drawer-button-text-color: #00ff00;

		--default-drawer-reset-button-color: #000000;
		--default-drawer-reset-button-text-color: #00ff00;
		--default-drawer-reset-button-hover-color: #00ff00;
		--default-drawer-reset-button-hover-text-color: #000000;
	}

	:root[svelvet-theme='Blue/Yellow'] {
		--default-node-color: #0000ff;
		--default-node-border-color: #ffff00;
		--default-node-selection-color: #ffff00;
		--default-text-color: #ffff00;
		--default-node-shadow: var(--shadow-elevation-medium);

		--default-background-color: #0000ff;
		--default-dot-color: #ffff00;

		--default-accent-color: #ffff00;
		--default-primary-color: #0000ff;

		--default-selection-box-color: #ffff00;

		--default-edge-color: #ffff00;
		--default-target-edge-color: #0000ff;
		--default-edge-shadow: var(--shadow-elevation-medium);
		--default-label-color: #ffff00;
		--default-label-text-color: #0000ff;

		--plugin-border: #ffff00;
		--default-controls-border: var(--plugin-border);
		--default-minimap-border: var(--plugin-border);
		--default-theme-toggle-border: var(--plugin-border);

		--default-anchor-color: #ffff00;
		--default-anchor-border-color: #0000ff;

		--default-anchor-connected: #ffff00;
		--default-anchor-connected-border: #0000ff;

		--default-anchor-connecting: #ffff00;
		--default-anchor-connecting-border: #0000ff;

		--default-anchor-hovering: #ffff00;
		--default-anchor-hovering-border: #0000ff;

		--default-minimap-background-color: #0000ff;
		--default-minimap-node-color: #ffff00;

		--default-controls-background-color: #0000ff;
		--default-controls-text-color: #ffff00;

		--default-theme-toggle-text-color: #ffff00;
		--default-theme-toggle-color: #0000ff;

		--default-drawer-button-color: #0000ff;
		--default-drawer-button-text-color: #ffff00;

		--default-drawer-reset-button-color: #0000ff;
		--default-drawer-reset-button-text-color: #ffff00;
		--default-drawer-reset-button-hover-color: #ffff00;
		--default-drawer-reset-button-hover-text-color: #0000ff;
	}

	:root[svelvet-theme='Yellow/Blue'] {
		--default-node-color: #ffff00;
		--default-node-border-color: #0000ff;
		--default-node-selection-color: #0000ff;
		--default-text-color: #0000ff;
		--default-node-shadow: var(--shadow-elevation-medium);

		--default-background-color: #ffff00;
		--default-dot-color: #0000ff;

		--default-accent-color: #0000ff;
		--default-primary-color: #ffff00;

		--default-selection-box-color: #0000ff;

		--default-edge-color: #0000ff;
		--default-target-edge-color: #ffff00;
		--default-edge-shadow: var(--shadow-elevation-medium);
		--default-label-color: #0000ff;
		--default-label-text-color: #ffff00;

		--plugin-border: #0000ff;
		--default-controls-border: var(--plugin-border);
		--default-minimap-border: var(--plugin-border);
		--default-theme-toggle-border: var(--plugin-border);

		--default-anchor-color: #0000ff;
		--default-anchor-border-color: #ffff00;

		--default-anchor-connected: #0000ff;
		--default-anchor-connected-border: #ffff00;

		--default-anchor-connecting: #0000ff;
		--default-anchor-connecting-border: #ffff00;

		--default-anchor-hovering: #0000ff;
		--default-anchor-hovering-border: #ffff00;

		--default-minimap-background-color: #ffff00;
		--default-minimap-node-color: #0000ff;

		--default-controls-background-color: #ffff00;
		--default-controls-text-color: #0000ff;

		--default-theme-toggle-text-color: #0000ff;
		--default-theme-toggle-color: #ffff00;

		--default-drawer-button-color: #ffff00;
		--default-drawer-button-text-color: #0000ff;

		--default-drawer-reset-button-color: #ffff00;
		--default-drawer-reset-button-text-color: #0000ff;
		--default-drawer-reset-button-hover-color: #0000ff;
		--default-drawer-reset-button-hover-text-color: #ffff00;
	}

	:root[svelvet-theme='Grayscale'] {
		--default-node-color: #666666;
		--default-node-border-color: #f2f2f2;
		--default-node-selection-color: #333333;
		--default-text-color: #f2f2f2;
		--default-node-shadow: var(--shadow-elevation-medium);

		--default-background-color: #333333;
		--default-dot-color: #999999;

		--default-accent-color: #333333;
		--default-primary-color: #999999;

		--default-selection-box-color: #f2f2f2;

		--default-edge-color: #999999;
		--default-target-edge-color: #666666;
		--default-edge-shadow: var(--shadow-elevation-medium);
		--default-label-color: #666666;
		--default-label-text-color: #f2f2f2;

		--plugin-border: #999999;
		--default-controls-border: var(--plugin-border);
		--default-minimap-border: var(--plugin-border);
		--default-theme-toggle-border: var(--plugin-border);

		--default-anchor-color: #999999;
		--default-anchor-border-color: #666666;

		--default-anchor-connected: #999999;
		--default-anchor-connected-border: #666666;

		--default-anchor-connecting: #999999;
		--default-anchor-connecting-border: #f2f2f2;

		--default-anchor-hovering: #999999;
		--default-anchor-hovering-border: #f2f2f2;

		--default-minimap-background-color: #333333;
		--default-minimap-node-color: #666666;

		--default-controls-background-color: #333333;
		--default-controls-text-color: #f2f2f2;

		--default-theme-toggle-text-color: #f2f2f2;
		--default-theme-toggle-color: #333333;

		--default-drawer-button-color: #999999;
		--default-drawer-button-text-color: #f2f2f2;

		--default-drawer-reset-button-color: #999999;
		--default-drawer-reset-button-text-color: #f2f2f2;
		--default-drawer-reset-button-hover-color: #f2f2f2;
		--default-drawer-reset-button-hover-text-color: #333333;
	}

	:root[svelvet-theme='Black/Pink'] {
		--default-node-color: #000000;
		--default-node-border-color: #ff69b4;
		--default-node-selection-color: #333333;
		--default-text-color: #ff69b4;
		--default-node-shadow: var(--shadow-elevation-medium);

		--default-background-color: #000000;
		--default-dot-color: #ff69b4;

		--default-accent-color: #333333;
		--default-primary-color: #ff69b4;

		--default-selection-box-color: #ff69b4;

		--default-edge-color: #ff69b4;
		--default-target-edge-color: #000000;
		--default-edge-shadow: var(--shadow-elevation-medium);
		--default-label-color: #000000;
		--default-label-text-color: #ff69b4;

		--plugin-border: #ff69b4;
		--default-controls-border: var(--plugin-border);
		--default-minimap-border: var(--plugin-border);
		--default-theme-toggle-border: var(--plugin-border);

		--default-anchor-color: #ff69b4;
		--default-anchor-border-color: #000000;

		--default-anchor-connected: #ff69b4;
		--default-anchor-connected-border: #000000;

		--default-anchor-connecting: #ff69b4;
		--default-anchor-connecting-border: #333333;

		--default-anchor-hovering: #ff69b4;
		--default-anchor-hovering-border: #333333;

		--default-minimap-background-color: #000000;
		--default-minimap-node-color: #333333;

		--default-controls-background-color: #000000;
		--default-controls-text-color: #ff69b4;

		--default-theme-toggle-text-color: #ff69b4;
		--default-theme-toggle-color: #000000;

		--default-drawer-button-color: #ff69b4;
		--default-drawer-button-text-color: #000000;

		--default-drawer-reset-button-color: #ff69b4;
		--default-drawer-reset-button-text-color: #000000;
		--default-drawer-reset-button-hover-color: #000000;
		--default-drawer-reset-button-hover-text-color: #ff69b4;
	}
</style>
