<!-- @migration-task Error while migrating Svelte code: `{@render ...}` tags can only contain call expressions
https://svelte.dev/e/render_tag_invalid_expression -->
<!-- @migration-task Error while migrating Svelte code: `{@render ...}` tags can only contain call expressions
https://svelte.dev/e/render_tag_invalid_expression -->
<script context="module" lang="ts">
	import Graph from '../Graph/Graph.svelte';
	import FlowChart from '$lib/components/FlowChart/FlowChart.svelte';
	import { onMount, setContext } from 'svelte';
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
	$props = {
		mermaid: '',
		theme: 'light',
		id: 0,
		snapTo: 0,
		zoom: 1,
		TD: false,
		editable: true,
		locked: false,
		width: 0,
		height: 0,
		minimap: false,
		controls: false,
		toggle: false,
		drawer: false,
		contrast: false,
		fitView: false,
		selectionColor: 'lightblue',
		edgeStyle: 'bezier',
		endStyles: [null, null],
		edge: null,
		disableSelection: false,
		mermaidConfig: {},
		translation: { x: 0, y: 0 },
		trackpadPan: false,
		modifier: 'meta',
		raiseEdgesOnSelect: false,
		edgesAboveNode: false,
		title: '',
		fixedZoom: false,
		pannable: true
	};

	$state = {
		graph: null,
		direction: $props.TD ? 'TD' : 'LR',
		backgroundExists: false,
		edgeStore: null
	};

	setContext('snapTo', $props.snapTo);
	setContext('edgeStyle', $props.edgeStyle);
	setContext('endStyles', $props.endStyles);
	setContext('graphEdge', $props.edge);
	setContext('raiseEdgesOnSelect', $props.raiseEdgesOnSelect);
	setContext('edgesAboveNode', $props.edgesAboveNode);
	setContext('graph', $state.graph);

	// function to load a graph from local storage
	// occurs after Svelvet renders
	onMount(() => {
		const stateObject = localStorage.getItem('state');
		if (stateObject) {
			$state.graph = reloadStore(stateObject);
			graphStore.add($state.graph, $state.graph.id);
		} else {
			let graphKey: GraphKey = `G-${$props.id || graphStore.count() + 1}`;

			$state.graph = createGraph(graphKey, {
				zoom: $props.zoom,
				direction: $state.direction,
				editable: $props.editable,
				locked: $props.locked,
				translation: $props.translation
			});

			graphStore.add($state.graph, graphKey);
		}
	});

	$effect(() => {
		$state.backgroundExists = $$snippets.background;
	});

	$effect(() => {
		$state.edgeStore = $state.graph && $state.graph.edges;
	});

	$effect(() => {
		if ($state.graph) $state.graph.transforms.scale.set($props.zoom);
	});

	$effect(() => {
		if ($state.edgeStore) {
			$state.edgeStore.onEdgeChange((edge, type) => {
				dispatchEvent(
					new CustomEvent(type, {
						detail: {
							sourceAnchor: edge.source as Anchor,
							targetAnchor: edge.target as Anchor,
							sourceNode: edge.source.node as Node,
							targetNode: edge.target.node as Node
						}
					})
				);
			});
		}
	});

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
		const sourceNode = $state.graph.nodes.get(sourceNodeKey);
		if (!sourceNode) return;
		const sourceAnchor = sourceNode.anchors.get(`A-${source[1]}/N-${source[0]}`);
		if (!sourceAnchor) return;
		const targetNodeKey: NodeKey = `N-${target[0]}`;
		const targetNode = $state.graph.nodes.get(targetNodeKey);
		if (!targetNode) return;
		const targetAnchor = targetNode.anchors.get(`A-${target[1]}/N-${target[0]}`);
		if (!targetAnchor) return;
		const edgeKey = $state.graph.edges.match(sourceAnchor, targetAnchor);
		if (!edgeKey) return;
		$state.graph.edges.delete(edgeKey[0]);
	}
</script>

{#if $state.graph}
	<Graph
		{...$props}
		graph={$state.graph}
		on:edgeDrop
	>
		{#if $props.mermaid.length}
			<FlowChart {...$props} />
		{/if}
			{@render children}
	</Graph>
{:else}
	<div
		class="svelvet-temp"
		style:width={$props.width ? $props.width + 'px' : '100%'}
		style:height={$props.height ? $props.height + 'px' : '100%'}
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
		--default-edge-shadow: var (--shadow-elevation-medium);
		--default-label-color: #ffff00;
		--default-label-text-color: #000000;

		--plugin-border: #ffff00;
		--default-controls-border: var(--plugin-border);
		--default-minimap-border: var(--plugin-border);
		--default-theme-toggle-border: var (--plugin-border);

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
