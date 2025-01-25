import { createGraph, createNode, createAnchor, createEdge } from '../creators';
import type { AnchorKey, GraphKey, NodeConfig, NodeKey, CustomEdgeKey, Anchor } from '$lib/types';
import type { ComponentType } from 'svelte';
import type { Graph } from '$lib/types/graph';

export function reloadStore(store: string): Graph {
	const object = JSON.parse(store);

	const graph = createGraph(object.id, {
		editable: object.editable,
		direction: object.direction,
		locked: object.locked,
		zoom: object.transforms?.scale ?? 1,
		translation: object.transforms?.translation ?? { x: 0, y: 0 },
		edge: object.edge
	});

	Object.entries(object.nodes).forEach(([id, node]) => {
		const nodeProps: NodeConfig = node as NodeConfig;
		const newNode = createNode(nodeProps);

		Object.entries(newNode.anchors).forEach(([id, anchor]) => {
			const newAnchor = createAnchor(
				graph,
				newNode,
				id as AnchorKey,
				anchor.position,
				{ width: 0, height: 0 },
				anchor.store,
				anchor.edge,
				anchor.type,
				anchor.direction,
				anchor.dynamic,
				anchor.key,
				anchor.edgeColor
			);
			newNode.anchors.add(newAnchor, id as AnchorKey);
		});
		graph.nodes.add(newNode, id as NodeKey);
	});

	Object.entries(object.edges).forEach(([id, edge]) => {
		const edgeData = edge as { connection: { source: Anchor; target: Anchor }; component: ComponentType | null };
		const newEdge = createEdge(edgeData.connection, edgeData.component);
		graph.edges.add(newEdge, id as CustomEdgeKey);
	});

	return graph;
}
