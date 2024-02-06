import type { Graph } from '$lib/types';
import { get } from 'svelte/store';
import type { WritableNode } from '$lib/types';
import type { Node } from '$lib/types';
import { writable } from 'svelte/store';
import type { Readable } from 'svelte/store';
// possible use case: flatted library for circular references in JSON string
import { stringify } from 'flatted';

function isSvelteStore(value: any): value is Readable<any> {
	return value && typeof value.subscribe === 'function';
}

// *******old traverse function*******
// Function to traverse a nested object and extract the data
// looks like this function should traverse a svelte store
function traverse(obj: Record<string, any>, depth = 0) {
	// Added depth parameter for better clarity in logs
	// eslint-disable-next-line no-console
	console.log(`--- Traverse activated at depth ${depth} ---`);

	const output: Record<string, any> = {};
	for (const key in obj) {
		const value = obj[key];

		// Log for entering a specific property
		// eslint-disable-next-line no-console
		console.log(`Entering key: ${key} at depth ${depth}`);

		if (key === 'nodes' && typeof value === 'object' && value.getAll) {
			// eslint-disable-next-line no-console
			console.log('nodes prop found!');
			// eslint-disable-next-line no-console
			console.log('NODES ARRAY: ', value.getAll());
			// traverse the nodes array
			const nodesArray = value.getAll();

			output[key] = nodesArray;
			// eslint-disable-next-line no-console
			console.log('TRAVERSE CACHE AFTER FINDING NODES PROP:', output);

			traverse(nodesArray, depth + 1);
		}

		// if (key === 'nodes' && typeof value === 'object' && value.getAll) {
		// 	// eslint-disable-next-line no-console
		// 	console.log('nodes prop found!');
		// 	const nodesArray = value.getAll(); // Correctly obtaining the array of nodes
		// 	// eslint-disable-next-line no-consol
		// 	console.log('NODES ARRAY: ', nodesArray);

		// 	// Process each node to handle anchors or any other properties
		// 	const processedNodes = nodesArray.map(node => {
		// 		// Example: Process anchors within each node
		// 		if (node.anchors && typeof node.anchors.getAll === 'function') {
		// 			const anchorsArray = node.anchors.getAll(); // Obtain the anchors array
		// 			// eslint-disable-next-line no-console
		// 			console.log('ANCHORS ARRAY:', anchorsArray);
		// 			node.anchors = anchorsArray; // Assign the processed anchors array back to the node
		// 		}
		// 		return node; // Return the processed node
		// 	});

		// 	output[key] = processedNodes; // Ensure this assignment maintains the expected structure
		// 	// eslint-disable-next-line no-console
		// 	console.log('TRAVERSE CACHE AFTER FINDING NODES PROP:', output);
		// }
		else if (isSvelteStore(value)) {
			// eslint-disable-next-line no-console
			console.log(`The current prop, ${value}, is a Svelte store at key: ${key}`);
			const storeValue = get(value);
			if (typeof storeValue === 'object' && storeValue !== null) {
				// eslint-disable-next-line no-console
				console.log(`Retraversing storeValue at key: ${key}, depth: ${depth + 1}`);
				output[key] = traverse(storeValue, depth + 1); // Pass depth + 1 for the next level
			}
		} else if (typeof value === 'object') {
			// eslint-disable-next-line no-console
			console.log(`prop ${key} is a regular object at depth ${depth}`);
			output[key] = traverse(value, depth + 1); // Pass depth + 1 for the next level
		} else {
			// eslint-disable-next-line no-console
			console.log(`prop ${key} is a regular value at depth ${depth}`);
			output[key] = value;
		}

		// Log for exiting a specific property
		// eslint-disable-next-line no-console
		console.log(`Exiting key: ${key} at depth ${depth}`);
	}

	// Log for completing traversal at a specific depth
	// eslint-disable-next-line no-console
	console.log(`--- Traverse complete at depth ${depth} ---`);
	// eslint-disable-next-line no-console
	console.log(`Final output at depth ${depth}:`, output);

	return output;
}

// Custom replacer function for JSON.stringify()
// change key to be intentionally not used
function domRectReplacer(_key: string, value: any) {
	if (value instanceof DOMRectReadOnly) {
		return {
			x: value.x,
			y: value.y,
			width: value.width,
			height: value.height
		};
	}
	return value;
}

// Function to get JSON stringified data from nested Svelte store
export function getJSONState(store: any) {
	// eslint-disable-next-line no-console
	console.log('graph state object:', store);
	// eslint-disable-next-line no-console
	console.log('nodes object before traverse: ', store.nodes.getAll());

	const data = traverse(store);

	// eslint-disable-next-line no-console
	console.log('Nodes after traverse:', data.nodes);
	// eslint-disable-next-line no-console
	// console.log('Graph state object after traverse:', data)

	// const raw = stringify(data, domRectReplacer);
	const raw = JSON.stringify(data, domRectReplacer);

	localStorage.setItem('state', raw);
	// eslint-disable-next-line no-console
	console.log('raw:', raw);
	return raw;
}
