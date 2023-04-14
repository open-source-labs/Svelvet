<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { Graph, Node as NodeType, NodeConfig, Theme, GroupKey } from '$lib/types';
	import * as s from '$lib/constants/styles';
	import { createNode } from '$lib/utils';
	import InternalNode from './InternalNode.svelte';
	import DefaultNode from './DefaultNode.svelte';
	import { THEMES } from '$lib/constants/themes';
	import { get } from 'svelte/store';

	const graph = getContext<Graph>('graph');
	const theme = getContext<Theme>('theme');

	//const storedNode = JSON.parse(localStorage.getItem('state'))?.nodes?[id]
	const { nodes } = graph;

	export let position = { x: 0, y: 0 };
	export let dimensions = { width: s.NODE_WIDTH, height: s.NODE_HEIGHT };
	export let id: string | number = 0;
	// export let width = s.NODE_WIDTH;
	// export let height = s.NODE_HEIGHT;
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
	export let zIndex = 1;
	export let editable = false;
	export let locked = false;
	export let edge: ConstructorOfATypedSvelteComponent | null = null;

	let node: NodeType;
	const group: GroupKey = getContext('group');

	onMount(() => {
		const direction = TD ? 'TD' : LR ? 'LR' : graph.direction;

		const groupBox = graph.groupBoxes.get(group);

		const nodeCount = graph.nodes.count() + 1;

		const foundNode = graph.nodes.get(`N-${id || nodeCount}`);
		if (!foundNode) {
			const config: NodeConfig = {
				id: id || nodeCount,
				// width,
				position: groupBox
					? { x: get(groupBox.position.x), y: get(groupBox.position.y) }
					: position,
				dimensions,
				// height,
				bgColor,
				editable: editable || graph.editable,
				borderRadius,
				textColor,
				borderColor,
				label,
				group,
				selectionColor,
				resizable,
				inputs,
				outputs,
				zIndex,
				direction,
				locked
			};
			if (edge) config.edge = edge;
			node = createNode(config);
		} else {
			node = foundNode;
		}

		if (groupBox) {
			graph.groups.update((groups) => {
				const nodes = get(groups[group].nodes);
				groups[group].nodes.set(new Set([...nodes, node]));
				return groups;
			});
		}

		graph.nodes.add(node, node.id);
	});

	// All these functions below essentially enable data binding to the props
	// We should not recommend developers utilize this, but it is a nice feature
	$: if (node) {
		node.bgColor.set(bgColor);
	}
	$: if (node) {
		node.label.set(label);
	}
	$: if (node) {
		node.textColor.set(textColor);
	}
	$: if (node) {
		node.borderColor.set(borderColor);
	}
	$: if (node) {
		node.selectionColor.set(selectionColor);
	}
	$: if (node) {
		node.resizable.set(resizable);
	}
	$: if (node) {
		node.editable.set(editable);
	}
	$: if (node) {
		node.locked.set(locked);
	}
	$: if (node) {
		node.inputs.set(inputs);
	}
	$: if (node) {
		node.outputs.set(outputs);
	}
	$: if (node) {
		node.zIndex.set(zIndex);
	}
	// $: if (node) {
	// 	node.position.x.set(position.x);
	// 	node.position.y.set(position.y);
	// }
	$: if (node) {
		node.inputs.set(inputs);
	}
	$: if (node) {
		node.outputs.set(outputs);
	}
</script>

{#if node && $nodes[node.id]}
	<InternalNode let:selected let:grabHandle on:nodeClicked {node}>
		<slot {selected} {grabHandle} {node}>
			<DefaultNode {selected} {grabHandle} on:connection on:disconnection />
		</slot>
	</InternalNode>
{/if}
