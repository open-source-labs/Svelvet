import type { Graph } from '$lib/types';
// import { writable } from 'svelte/store';

// function createMockStore() {
//     const store = writable({
//         someProperty: "test value",
//         anotherProperty: 123,
//         nestedStore: writable({ nestedKey: "nested value" }),
//         // Add more properties as needed to mimic the structure of your Graph store
//     });
//     return store;
// }


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
	// eslint-disable-next-line no-console
	console.log('obj:', obj);
	// added type object with string indexing
	const output: Record<string, any> = {};

	for (const key in obj) {
		const value = obj[key];
		// eslint-disable-next-line no-console
        console.log(`Key: ${key}, Value:`, value);

        if (isStore(value)) {
            let storeValue;
            value.subscribe(($value: any) => {
                storeValue = $value;
				// eslint-disable-next-line no-console
                console.log(`Store value for ${key}:`, storeValue);
            })();
            output[key] = typeof storeValue === 'object' ? traverse(storeValue) : storeValue;


        } else if (typeof value === 'object') {
            output[key] = traverse(value);
        } else {
            output[key] = value;
        }
    }
	// eslint-disable-next-line no-console
	console.log('output:', output);
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
	console.log('store:', store);
	const data = traverse(store);
	const raw = JSON.stringify(data, domRectReplacer);
	// const raw = JSON.stringify(data);

	// const object = JSON.parse(raw);
	// const node: Node = createNode(object.nodes['N-1']);
	// store.nodes.add(node, 'N-TEST');
	localStorage.setItem('state', raw);
	// eslint-disable-next-line no-console
	console.log('raw:', raw);
	return raw;
}


// const mockStore = createMockStore();
// getJSONState(mockStore);