import type { Graph } from '$lib/types';

// added interface for more strict check of a svelte store
interface StoreLike {
	subscribe: (callback: (value: any) => void) => () => void;
}

// Function to check if a value is a Svelte store
// value must adhere to StoreLike interface
function isStore(value: StoreLike): boolean {
	return value && typeof value.subscribe === 'function';
}

// Function to traverse a nested object and extract the data
// looks like this function should traverse a svelte store
function traverse(obj: Record<string, any>) {
	// added type object with string indexing
	const output: Record<string, any> = {};

	for (const key in obj) {
		const value = obj[key];
		if (isStore(value)) {
			let storeValue;
			// subscribe method should be found in a svelte store
			value.subscribe(($value: any) => {
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
export function getJSONState(store: Graph) {
	// eslint-disable-next-line no-console
	console.log(store);
	const data = traverse(store);
	const raw = JSON.stringify(data, domRectReplacer);
	// const object = JSON.parse(raw);
	// const node: Node = createNode(object.nodes['N-1']);
	// store.nodes.add(node, 'N-TEST');
	localStorage.setItem('state', raw);
	// eslint-disable-next-line no-console
	console.log(raw);
	return raw;
}