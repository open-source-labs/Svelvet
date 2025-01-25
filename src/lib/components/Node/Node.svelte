<script context="module" lang="ts">
	import InternalNode from './InternalNode.svelte';
	import DefaultNode from './DefaultNode.svelte';
	import { get } from 'svelte/store';
	import { createNode } from '$lib/utils';
	import { getContext, onDestroy, onMount, setContext } from 'svelte';
	import type { ComponentType } from 'svelte';
	import type { NodeKey, Anchor, AnchorKey } from '$lib/types';
	import type { Graph, Node as NodeType, NodeConfig, GroupKey } from '$lib/types';
	import type { Connections, CSSColorString, InitialDimensions } from '$lib/types';
</script>

<script lang="ts">
	const graph = getContext<Graph>('graph');
	const group: GroupKey = getContext('group');

	$props = {
		position: { x: 0, y: 0 },
		drop: 'cursor',
		dimensions: null,
		id: 0,
		bgColor: null,
		borderRadius: null,
		borderColor: null,
		borderWidth: null,
		selectionColor: null,
		textColor: null,
		resizable: false,
		label: '',
		inputs: 1,
		outputs: 1,
		width: null,
		height: null,
		TD: false,
		LR: false,
		zIndex: 1,
		editable: true,
		locked: false,
		rotation: 0,
		edge: null,
		connections: [],
		useDefaults: false,
		center: false,
		dynamic: false,
		title: ''
	};

	//External stores
	const nodes = graph.nodes;

	setContext('dynamic', $props.dynamic);

	$state = {
		node: null,
		isDefault: true,
		priorPosition: $props.position
	};

	onMount(() => {
		const direction = $props.TD ? 'TD' : $props.LR ? 'LR' : graph.direction;

		const groupBox = graph.groupBoxes.get(group);

		const nodeCount = graph.nodes.count() + 1;

		$state.isDefault = !$$snippets.default;
		if ($$snippets.anchorWest || $$snippets.anchorEast || $$snippets.anchorNorth || $$snippets.anchorSouth)
			$state.isDefault = false;

		const initialDimensions: InitialDimensions = $props.dimensions
			? $props.dimensions
			: $props.width || $props.height
			? { width: $props.width || $props.height || 200, height: $props.height || $props.width || 100 }
			: $state.isDefault
			? { width: 200, height: 100 }
			: { width: 0, height: 0 };

		const config: NodeConfig = {
			id: $props.id || nodeCount,
			position:
				$props.drop === 'cursor'
					? { x: get(graph.cursor).x, y: get(graph.cursor).y }
					: groupBox
					? { x: get(groupBox.position).x + $props.position.x, y: get(groupBox.position).y + $props.position.y }
					: $props.position,
			dimensions: initialDimensions,
			editable: $props.editable || graph.editable,
			label: $props.label,
			group,
			resizable: $props.resizable,
			inputs: $props.inputs,
			outputs: $props.outputs,
			zIndex: $props.zIndex,
			direction,
			locked: $props.locked,
			rotation: $props.rotation
		};
		if ($props.connections.length) config.connections = $props.connections;
		if ($props.borderWidth) config.borderWidth = $props.borderWidth;
		if ($props.borderRadius) config.borderRadius = $props.borderRadius;
		if ($props.borderColor) config.borderColor = $props.borderColor;
		if ($props.selectionColor) config.selectionColor = $props.selectionColor;
		if ($props.textColor) config.textColor = $props.textColor;
		if ($props.bgColor) config.bgColor = $props.bgColor;
		if ($props.edge) config.edge = $props.edge;
		$state.node = createNode(config);

		if (groupBox) {
			graph.groups.update((groups) => {
				const nodes = get(groups[group].nodes);
				groups[group].nodes.set(new Set([...nodes, $state.node]));
				return groups;
			});
		}

		graph.nodes.add($state.node, $state.node.id);
	});

	$effect(() => {
		if ($state.node) {
			$state.node.connections.set($props.connections);
		}
	});

	onDestroy(() => {
		graph.nodes.delete($state.node.id);
	});

	function connect(connections: number | string | [number | string, number | string]) {
		if (!$state.node) return;
		$state.node.connections.set([connections]);
	}

	function disconnect(connections: number | string | Connections) {
		if (!$state.node) return;
		const adjustedConnections = Array.isArray(connections) ? connections : [connections];

		adjustedConnections.forEach((connection) => {
			const [nodeId, anchorId] = Array.isArray(connection) ? [connection[0], connection[1]] : [connection, null];
			const nodeKey: NodeKey = `N-${nodeId}`;
			const otherNode = graph.nodes.get(nodeKey);
			if (!otherNode) return;
			let specificAnchor: Anchor | null = null;
			const anchorKey: AnchorKey | null = anchorId ? `A-${anchorId}/${nodeKey}` : null;
			if (anchorKey) {
				specificAnchor = otherNode.anchors.get(anchorKey);
			}
			const matchingEdgeKeys = graph.edges.match($state.node, otherNode, specificAnchor);
			if (matchingEdgeKeys.length)
				graph.edges.delete(matchingEdgeKeys[matchingEdgeKeys.length - 1]);
		});
	}

	setContext('connect', connect);
	setContext('disconnect', disconnect);

	$effect(() => {
		if ($state.node) {
			$state.node.bgColor.set($props.bgColor);
		}
	});
	$effect(() => {
		if ($state.node) {
			$state.node.label.set($props.label);
		}
	});
	$effect(() => {
		if ($state.node) {
			$state.node.textColor.set($props.textColor);
		}
	});
	$effect(() => {
		if ($state.node) {
			$state.node.borderColor.set($props.borderColor);
		}
	});
	$effect(() => {
		if ($state.node) {
			$state.node.selectionColor.set($props.selectionColor);
		}
	});
	$effect(() => {
		if ($state.node) {
			$state.node.resizable.set($props.resizable);
		}
	});
	$effect(() => {
		if ($state.node) {
			$state.node.editable.set($props.editable);
		}
	});
	$effect(() => {
		if ($state.node) {
			$state.node.locked.set($props.locked);
		}
	});
	$effect(() => {
		if ($state.node) {
			$state.node.inputs.set($props.inputs);
		}
	});
	$effect(() => {
		if ($state.node) {
			$state.node.outputs.set($props.outputs);
		}
	});
	$effect(() => {
		if ($state.node) {
			$state.node.zIndex.set($props.zIndex);
		}
	});

	$derived nodePosition = $state.node && $state.node?.position;

	$effect(() => {
		if ($state.node) {
			const { x: priorX, y: priorY } = $state.priorPosition;
			const { x: nodeX, y: nodeY } = $nodePosition;
			const { x: propX, y: propY } = $props.position;

			const areDifferent = propX !== nodeX || propY !== nodeY;

			const propChanged = propX !== priorX || propY !== priorY;

			if (areDifferent) {
				if (propChanged) {
					$state.priorPosition = $props.position;
					$state.node.position.set($props.position);
				} else {
					$state.priorPosition = $nodePosition;
					$props.position = $nodePosition;
				}
			}
		}
	});
	$effect(() => {
		if ($state.node) {
			$state.node.inputs.set($props.inputs);
		}
	});
	$effect(() => {
		if ($state.node) {
			$state.node.outputs.set($props.outputs);
		}
	});

	// Validation for node properties
	const validateNodeProps = () => {
		if ($props.bgColor !== null && typeof $props.bgColor !== 'string') {
			throw new Error('Invalid value for bgColor property');
		}
		if ($props.borderColor !== null && typeof $props.borderColor !== 'string') {
			throw new Error('Invalid value for borderColor property');
		}
		if ($props.label !== null && typeof $props.label !== 'string') {
			throw new Error('Invalid value for label property');
		}
		if ($props.width !== null && typeof $props.width !== 'number') {
			throw new Error('Invalid value for width property');
		}
		if ($props.height !== null && typeof $props.height !== 'number') {
			throw new Error('Invalid value for height property');
		}
		if ($props.locked !== null && typeof $props.locked !== 'boolean') {
			throw new Error('Invalid value for locked property');
		}
		if ($props.center !== null && typeof $props.center !== 'boolean') {
			throw new Error('Invalid value for center property');
		}
		if ($props.inputs !== null && typeof $props.inputs !== 'number') {
			throw new Error('Invalid value for inputs property');
		}
		if ($props.outputs !== null && typeof $props.outputs !== 'number') {
			throw new Error('Invalid value for outputs property');
		}
		if ($props.rotation !== null && typeof $props.rotation !== 'number') {
			throw new Error('Invalid value for rotation property');
		}
		if ($props.zIndex !== null && typeof $props.zIndex !== 'number') {
			throw new Error('Invalid value for zIndex property');
		}
		if ($props.TD !== null && typeof $props.TD !== 'boolean') {
			throw new Error('Invalid value for TD property');
		}
		if ($props.LR !== null && typeof $props.LR !== 'boolean') {
			throw new Error('Invalid value for LR property');
		}
		if ($props.useDefaults !== null && typeof $props.useDefaults !== 'boolean') {
			throw new Error('Invalid value for useDefaults property');
		}
		if ($props.nodeDirection !== null && typeof $props.nodeDirection !== 'string') {
			throw new Error('Invalid value for nodeDirection property');
		}
	};

	validateNodeProps();
</script>

{#if $state.node && $nodes.get($state.node.id)}
	<InternalNode
		node={$state.node}
		center={$props.center || $props.drop === 'center'}
		isDefault={$state.isDefault}
		useDefaults={$props.useDefaults}
		dimensionsProvided={!!$props.dimensions || !!$props.width || !!$props.height || $state.isDefault || false}
		nodeStore={graph.nodes}
		locked={graph.locked}
		groups={graph.groups}
		title={$props.title}
		maxZIndex={graph.maxZIndex}
		centerPoint={graph.center}
		cursor={graph.cursor}
		activeGroup={graph.activeGroup}
		editing={graph.editing}
		initialNodePositions={graph.initialNodePositions}
		onnodeClicked
		onnodeMount
		onnodeReleased
		onduplicate
		let:destroy
		let:selected
		let:grabHandle
	>
			{@render name="default"}
			<slot {selected} {grabHandle} {disconnect} {connect} node={$state.node} {destroy}>
				{#if $state.isDefault}
					<DefaultNode {selected} onconnection ondisconnection />
				{/if}
			</slot>
		{@/render}

		<div id={`anchors-west-${node.id}`} class="anchors left">
			{@render name="anchorWest"}
			<slot name="anchorWest" />
		{@/render}
		</div>
		<div id={`anchors-east-${node.id}`} class="anchors right">
			{@render name="anchorEast"}
			<slot name="anchorEast" />
		{@/render}
		</div>
		<div id={`anchors-north-${node.id}`} class="anchors top">
			{@render name="anchorNorth"}
			<slot name="anchorNorth" />
		{@/render}
		</div>
		<div id={`anchors-south-${node.id}`} class="anchors bottom">
			{@render name="anchorSouth"}
			<slot name="anchorSouth" />
		{@/render}
	</InternalNode>
{/if}
