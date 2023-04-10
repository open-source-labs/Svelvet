<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { Graph, Node as NodeType, NodeConfig, Theme } from '$lib/types';
	import * as s from '$lib/constants/styles';
	import { createNode } from '$lib/utils';
	import InternalNode from './InternalNode.svelte';
	import DefaultNode from './DefaultNode.svelte';
	import { THEMES } from '$lib/constants/themes';

	const graph = getContext<Graph>('graph');
	const theme = getContext<Theme>('theme');

	//const storedNode = JSON.parse(localStorage.getItem('state'))?.nodes?[id]
	const { nodes } = graph;

	export let position = { x: 0, y: 0 };
	export let dimensions = { width: 200, height: 100 };
	export let id: string | number = 0;
	export let width = s.NODE_WIDTH;
	export let height = s.NODE_HEIGHT;
	export let bgColor = THEMES[theme].node;
	export let borderRadius = s.NODE_BORDER_RADIUS;
	export let borderColor = THEMES[theme].border;
	export let selectionColor = THEMES[theme].selection;
	export let textColor = THEMES[theme].text;
	export let resizable = false;
	export let label = '';
	export let inputs = 1;
	export let outputs = 1;
	export let TD = false;
	export let LR = false;
	export let zIndex = 0;
	export let editable = false;
	export let locked = false;

	let node: NodeType;

	onMount(() => {
		const direction = TD ? 'TD' : LR ? 'LR' : graph.direction;

		const config: NodeConfig = {
			id: id || graph.nodes.count() + 1,
			width,
			position,
			dimensions,
			height,
			bgColor,
			editable: editable || graph.editable,
			borderRadius,
			textColor,
			borderColor,
			label,
			selectionColor,
			resizable,
			inputs,
			outputs,
			zIndex,
			direction,
			locked
		};
		node = createNode(config);
		graph.nodes.add(node, node.id);
	});
</script>

{#if node && $nodes[node.id]}
	<InternalNode let:selected let:grabHandle on:nodeClicked {node}>
		<slot {selected} {grabHandle}>
			<DefaultNode {selected} {grabHandle} on:connection on:disconnection />
		</slot>
	</InternalNode>
{/if}
