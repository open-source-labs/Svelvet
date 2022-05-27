import { writable, derived } from 'svelte/store';
import type { Node } from '../types/types';

export const defaultNode: Node = {
	id: 0,
	position: { x: 20, y: 20 },
	type: 'default',
	data: null,
	width: 100,
	height: 50,
	bgColor: 'white'
};

export const nodesStore = writable([]);
export const edgesStore = writable([]);
export const widthStore = writable(600);
export const heightStore = writable(600);

export const nodeSelected = writable(false);

export const onMouseMove = (e, nodeID) => {
	nodesStore.update((n) => {
		n.forEach((node) => {
			if (node.id === nodeID) {
				node.position.x += e.movementX;
				node.position.y += e.movementY;
			}
		});
		return [...n];
	});
};

// example to show that the $nodes values in here is accurate to the node.position.x and node.position.y changes in real time
// eachEdge has access to node.position.x and node.position.y changes inside of this derived function
export const derivedEdges = derived([nodesStore, edgesStore], ([$nodesStore, $edgesStore]) => {
	$edgesStore.forEach((edge) => {
		let sourceNode;
		let targetNode;
		$nodesStore.forEach((node) => {
			if (edge.source === node.id) sourceNode = node;
			if (edge.target === node.id) targetNode = node;
		});
		if (sourceNode) {
			let left = sourceNode.position.x;
			let top = sourceNode.position.y;
			let middle = sourceNode.width / 2;
			edge.sourceX = left + middle;
			edge.sourceY = top + sourceNode.height;
		}
		if (targetNode) {
			let left = targetNode.position.x;
			let top = targetNode.position.y;
			let middle = targetNode.width / 2;
			edge.targetX = left + middle;
			edge.targetY = top;
		}
	});
	return [...$edgesStore];
});
