<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { Graph, Node as NodeType, NodeConfig, Theme } from '$lib/types';
	import { generateKey } from '$lib/utils';
	import { get } from 'svelte/store';
	import * as s from '$lib/constants/styles';
	import { createNode } from '$lib/utils';
	import InternalNode from './InternalNode.svelte';
	import DefaultNode from '../DefaultNode.svelte';
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
	export let textColor = THEMES[theme].text;
	export let resizable = false;
	export let label = '';
	export let inputs = 1;
	export let outputs = 1;
	export let TD = false;
	export let LR = false;
	export let zIndex = 0;
	export let editable = false;

	let node: NodeType;

	onMount(() => {
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
			resizable,
			inputs,
			outputs,
			zIndex,
			direction: TD ? 'TD' : LR ? 'LR' : graph.direction
		};
		node = createNode(config);
		graph.nodes.add(node, node.id);
	});
</script>

{#if node && $nodes[node.id]}
	<InternalNode let:selected let:grabHandle {node}>
		<slot {selected} {grabHandle}>
			<DefaultNode {selected} {grabHandle} />
		</slot>
	</InternalNode>
{/if}
