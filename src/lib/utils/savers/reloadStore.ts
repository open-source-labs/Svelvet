import { createGraph, createNode } from '../creators';
import type { AnchorKey, GraphKey, NodeProps } from '$lib/types';
import { createAnchor } from '../creators/createAnchor';
import type { Anchor } from '$lib';

export function reloadStore(store: string) {
	const object = JSON.parse(store);

	const graph = createGraph(object.id as GraphKey, {
		...object,
		initialZoom: object.transforms.scale
	});
	Object.entries(object.nodes).forEach(([id, node]) => {
		const nodeProps: NodeProps = node;

		const newNode = createNode(nodeProps);

		Object.entries(node.anchors).forEach(([id, anchor]) => {
			const newAnchor = createAnchor(
				newNode,
				id as AnchorKey,
				anchor.position,
				{ width: 0, height: 0 },
				anchor.input,
				anchor.direction,
				anchor.dynamic
			);
			newNode.anchors.add(newAnchor, id);
		});
		graph.nodes.add(newNode, id);
	});
	Object.entries(object.edges).forEach(([id, edge]) => {
		graph.edges.add(edge, id);
	});
	return graph;
}
