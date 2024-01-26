import { createGraph, createNode, createAnchor, createEdge } from '../creators';
import type { AnchorKey, GraphKey, NodeConfig, NodeKey, CustomEdgeKey, Anchor } from '$lib/types';
import type { ComponentType } from 'svelte';

// added interface for createEdge function
interface EdgeDataType {
	connection: { source: Anchor; target: Anchor };
	component: ComponentType | null;
}

// store parameter is supposed to be Graph interface?
// store should be passed in as JSON string
export function reloadStore(store: string) {
	// turns JSON string to JS object
	// variable to store previous graph
	// of type Graph
	const object = JSON.parse(store);
	// create new graph

	// Check if transforms and scale are present and valid
	const hasValidTransforms = object.transforms && typeof object.transforms === 'object';
	const hasValidScale = hasValidTransforms && typeof object.transforms.scale === 'number';
	const defaultScaleValue = 1; // Example default scale

	const graph = createGraph(object.id as GraphKey, {
		...object,
		// initialZoom: object.transforms.scale
		initialZoom: hasValidScale ? object.transforms.scale : defaultScaleValue
	});
	// convert Graph.nodes into array, iterate over it
	Object.entries(object.nodes).forEach(([id, node]) => {
		//
		const nodeProps: NodeConfig = node as NodeConfig;
		const newNode = createNode(nodeProps);
		// change nodeProps.anchors to newNode.anchors as Object.entries argument
		Object.entries(newNode.anchors).forEach(([id, anchor]) => {
			// added all arguments that createAnchor function expects to receive
			const newAnchor = createAnchor(
				graph,
				newNode,
				id as AnchorKey,
				anchor.position,
				{ width: 0, height: 0 },
				anchor.store,
				anchor.edge,
				anchor.type,
				// anchor.input,
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
		const edgeData = edge as EdgeDataType;
		const newEdge = createEdge(edgeData.connection, edgeData.component);
		graph.edges.add(newEdge, id as CustomEdgeKey);
	});
	return graph;
}
