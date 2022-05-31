import { writable, derived } from 'svelte/store';

// const defaultNode = {
// 	id: null,
// 	type: null,
// 	position: {x: 10, y: 10},
// 	width: 100px,
// 	height: 50px,
// 	backgroundColor: white,
// }

export const nodesStore = writable([]);
export const edgesStore = writable([]);
export const widthStore = writable(600);
export const heightStore = writable(600);
export const backgroundStore = writable(false);

export const nodeSelected = writable(false);

// update position of selected node
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

// derive from nodesStore and edgesStore, pass in array value from each store
// updates edgesStore with new object properties (edge,sourceX, edge.targetY, etc) for edgesArray
	// $nodesStore and its individual object properties are reactive to node.position.x and node.position.y
	// so derivedEdges has access to node.position.x and node.position.y changes inside of this function
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
