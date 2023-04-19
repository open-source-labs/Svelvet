<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type {
		Graph,
		Node as NodeType,
		NodeConfig,
		GroupKey,
		Connections,
		CSSColorString
	} from '$lib/types';
	import { createNode } from '$lib/utils';
	import InternalNode from './InternalNode.svelte';
	import DefaultNode from './DefaultNode.svelte';
	import { get } from 'svelte/store';

	const graph = getContext<Graph>('graph');

	//const storedNode = JSON.parse(localStorage.getItem('state'))?.nodes?[id]
	const { nodes } = graph;

	export let position = { x: 0, y: 0 };
	export let dimensions = { width: 0, height: 0 };
	export let id: string | number = 0;
	export let bgColor: CSSColorString | null = null;
	export let borderRadius: number | null = null;
	export let borderColor: CSSColorString | null = null;
	export let borderWidth: number | null = null;
	export let selectionColor: CSSColorString | null = null;
	export let textColor: CSSColorString | null = null;
	export let resizable = false;
	export let label = '';
	export let inputs = 1;
	export let outputs = 1;
	export let TD = false;
	export let LR = false;
	export let zIndex = 1;
	export let editable = false;
	export let locked = false;
	export let rotation = 0;
	export let edge: ConstructorOfATypedSvelteComponent | null = null;
	export let connections: Connections = [];
	export let useDefaults = false;

	let node: NodeType;
	const group: GroupKey = getContext('group');
	let isDefault = true;

	onMount(() => {
		const direction = TD ? 'TD' : LR ? 'LR' : graph.direction;

		const groupBox = graph.groupBoxes.get(group);

		const nodeCount = graph.nodes.count() + 1;

		isDefault = !$$slots.default || useDefaults;

		const foundNode = graph.nodes.get(`N-${id || nodeCount}`);
		if (!foundNode) {
			const config: NodeConfig = {
				id: id || nodeCount,
				position: groupBox
					? { x: get(groupBox.position).x + position.x, y: get(groupBox.position).y + position.y }
					: position,
				dimensions,
				editable: editable || graph.editable,
				label,
				group,
				resizable,
				inputs,
				outputs,
				zIndex,
				direction,
				locked,
				nodeLevelConnections: connections,
				rotation
			};
			if (borderWidth) config.borderWidth = borderWidth;
			if (borderRadius) config.borderRadius = borderRadius;
			if (borderColor) config.borderColor = borderColor;
			if (selectionColor) config.selectionColor = selectionColor;
			if (textColor) config.textColor = textColor;
			if (bgColor) config.bgColor = bgColor;
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
	<InternalNode {isDefault} let:selected let:grabHandle on:nodeClicked {node}>
		<slot {selected} {grabHandle} {node}>
			<DefaultNode {selected} on:connection on:disconnection />
		</slot>
	</InternalNode>
{/if}
