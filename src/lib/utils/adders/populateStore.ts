import type { Node, Graph } from '$lib/types';

export function populateStore(nodes: Node[], graph: Graph) {
	for (const node of nodes) {
		graph.nodes.add(node, node.id);
	}
}
