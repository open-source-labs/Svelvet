import type { Node, NodeStore } from '$lib/types';

export function populateStore(nodes: Node[], nodeStore: NodeStore) {
	for (const node of nodes) {
		console.log(node);
		nodeStore.add(node);
	}
}
