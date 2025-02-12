import type { Graph } from '$lib/types';
import { get } from 'svelte/store';
import type { WritableNode } from '$lib/types';
import type { Node } from '$lib/types';
import { writable } from 'svelte/store';
import type { Readable } from 'svelte/store';

function isSvelteStore(value: any): value is Readable<any> {
	return value && typeof value.subscribe === 'function';
}

// *******old traverse function*******//
// Updated by Team v.11.0
// Function to traverse a nested object and extract the data
// looks like this function should traverse a svelte store
function traverse(obj: Record<string, any>): Record<string, any> {
	const output: Record<string, any> = {};
	for (const key in obj) {
		const value = obj[key];
		if (key === 'nodes' && typeof value === 'object' && typeof value.getAll === 'function') {
			const nodesArray = value.getAll(); // Obtener todos los nodos
			output[key] = nodesArray.map((node: any) => traverse(node)); // Procesar cada nodo
		} else if (isSvelteStore(value)) {
			const storeValue = get(value);
			output[key] =
				typeof storeValue === 'object' && storeValue !== null ? traverse(storeValue) : storeValue;
			// Si es un objeto anidado, recorrerlo
		} else if (typeof value === 'object' && value !== null) {
			output[key] = traverse(value);
		} else {
			// Para valores primitivos, asignarlos directamente
			output[key] = value;
		}
	}
	// console.log("Output después de traverse():", output);
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

// Updated by Team v.11.0
// Function to get JSON stringified data from nested Svelte store
export function getJSONState(store: any) {
	console.log('graph state object:', store);
	// // eslint-disable-next-line no-console
	// console.log('nodes object before traverse: ', store.nodes.getAll());
	const data = traverse(store);
	// console.log('Graph state object after traverse:', data)

	const raw = JSON.stringify(data, domRectReplacer);

	localStorage.setItem('state', raw);

	return raw;
}
