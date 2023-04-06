<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { Graph, Node as NodeType, NodeConfig, Theme } from '$lib/types';
	import { generateKey } from '$lib/utils';

	import * as s from '$lib/constants/styles';
	import { createNode } from '$lib/utils';
	import Node from '../Node/Node.svelte';
	import DefaultNode from '../DefaultNode.svelte';
	import { THEMES } from '$lib/constants/themes';

	const graph = getContext<Graph>('graph');
	const theme = getContext<Theme>('theme');

	//const storedNode = JSON.parse(localStorage.getItem('state'))?.nodes?[id]

	export let position = { x: 0, y: 0 };
	export let dimensions = { width: 200, height: 100 };
	export let id = generateKey();
	export let width = s.NODE_WIDTH;
	export let height = s.NODE_HEIGHT;
	export let bgColor = THEMES[theme].node;
	export let borderRadius = s.NODE_BORDER_RADIUS;
	export let borderColor = THEMES[theme].border;
	export let textColor = THEMES[theme].text;
	export let resizable = false;
	export let label = '';

	const config: NodeConfig = {
		id,
		width,
		position,
		dimensions,
		height,
		bgColor,
		borderRadius,
		textColor,
		borderColor,
		label,
		resizable
	};

	const node: NodeType = createNode(config);

	onMount(() => {
		graph.nodes.add(node, `N-${id}`);
	});
</script>

<Node let:selected let:grabHandle {node}>
	<slot {selected} {grabHandle}>
		<DefaultNode {selected} {grabHandle} />
	</slot>
</Node>
