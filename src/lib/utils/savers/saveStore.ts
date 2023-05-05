import type { Graph } from '$lib/types';

// Function to check if a value is a Svelte store
function isStore(value) {
	return value && typeof value.subscribe === 'function';
}

// Function to traverse a nested object and extract the data
function traverse(obj) {
	const output = {};

	for (const key in obj) {
		const value = obj[key];
		if (isStore(value)) {
			let storeValue;
			value.subscribe(($value) => {
				storeValue = $value;
			})();
			output[key] =
				typeof storeValue === 'object' && storeValue !== null ? traverse(storeValue) : storeValue;
		} else if (typeof value === 'object' && value !== null) {
			output[key] = traverse(value);
		} else {
			output[key] = value;
		}
	}

	return output;
}

// Custom replacer function for JSON.stringify()
function domRectReplacer(key, value) {
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
export function getJSONState(store: Graph) {
	const data = traverse(store);
	const raw = JSON.stringify(data, domRectReplacer);

	// const object = JSON.parse(raw);
	// const node: Node = createNode(object.nodes['N-1']);
	// store.nodes.add(node, 'N-TEST');
	localStorage.setItem('state', raw);
	return raw;
}
