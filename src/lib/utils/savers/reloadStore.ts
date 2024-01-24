import { createGraph, createNode } from '../creators';
import type { AnchorKey, GraphKey, NodeConfig } from '$lib/types';
import { createAnchor } from '../creators/createAnchor';

// store parameter is supposed to be Graph interface?
// store should be passed in as JSON string
export function reloadStore(store: string) {
	// turns JSON string to JS object
	// variable to store previous graph
	// of type Graph
	const object = JSON.parse(store);
	// createas new graph
	const graph = createGraph(object.id as GraphKey, {
		...object,
		initialZoom: object.transforms.scale
	});
	// convert Graph.nodes into array, iterate over it
	Object.entries(object.nodes).forEach(([id, node]) => {
		// 
		const nodeProps: NodeConfig = node as NodeConfig;
		const newNode = createNode(nodeProps);
		// change nodeProps.anchors to newNode.anchors as Object.entries argument
		Object.entries(newNode.anchors).forEach(([id, anchor]) => {
			const newAnchor = createAnchor(
				graph,
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
