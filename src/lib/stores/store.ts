import { writable, get } from 'svelte/store';

// NODES

// create an interface for nodes:
// id (number to identify each node)
// type (default vs input vs output)
// data (label)
// position (x, y coordinates)

// Create writable store for node
export const nodesStore = writable([]);

// Create an update function that sets node to the user's input values from Svelvet component
export const setNodes = (newNodes: any[]) => {
	nodesStore.update((n) => [...n, ...newNodes]);
};

// EDGES

export const edgesStore = writable([]);

/* 

export const edgesStore = derived(nodesStore, ($nodesStore) => {
	newEdges.forEach((edge) => {
		let sourceNode;
		let targetNode;
		$nodesStore.forEach((node) => {
			if (edge.source === node.id) sourceNode = node;
			if (edge.target === node.id) targetNode = node;
		});
		// Create sourceX, sourceY, targetX, targetY
		// need position of nodes,
		if (sourceNode) {
			let left = sourceNode.position.x;
			let top = sourceNode.position.y;
			// handle positions
			edge.sourceX = left + 50; // Node width is 100px so we hard-coded 50px
			edge.sourceY = top + 50;
		}
		if (targetNode) {
			let left = targetNode.position.x;
			let top = targetNode.position.y;
			// handle positions
			edge.targetX = left + 50;
			edge.targetY = top;
		}
	});
	console.log(newEdges);
	// find the node with the id of the source id
	// use that node to get handle positions
	// replace newEdges with updated information
	edgesStore.update((e) => [...e, ...newEdges]);
})

*/

export const setEdges = (newEdges: any[]) => {
	// iterate through newEdges and get the source id
	const $nodesStore = get(nodesStore);
	// unsure about the below $ :
	$: newEdges.forEach((edge) => {
		let sourceNode;
		let targetNode;
		$nodesStore.forEach((node) => {
			if (edge.source === node.id) sourceNode = node;
			if (edge.target === node.id) targetNode = node;
		});
		// Create sourceX, sourceY, targetX, targetY
		// need position of nodes,
		if (sourceNode) {
			let left = sourceNode.position.x;
			let top = sourceNode.position.y;
			// handle positions
			edge.sourceX = left + 50; // Node width is 100px so we hard-coded 50px
			edge.sourceY = top + 50;
		}
		if (targetNode) {
			let left = targetNode.position.x;
			let top = targetNode.position.y;
			// handle positions
			edge.targetX = left + 50;
			edge.targetY = top;
		}
	});
	console.log(newEdges);
	// find the node with the id of the source id
	// use that node to get handle positions
	// replace newEdges with updated information
	edgesStore.update((e) => [...e, ...newEdges]);
};

// const initialEdges = [
// 	{ id: 'e1-2', source: '1', target: '2', animated: true },
// 	{ id: 'e1-3', source: '1', target: '3', label: 'yay' }
// ];
//  {
// 		sourceX: 20,
// 		sourceY: 20,
// 		targetX: 300,
// 		targetY: 200,
// 		sourcePosition: Position.Bottom,
// 		targetPosition: Position.Top,
// 		label: 'yay bezier!'
// 	};

// HANDLES
