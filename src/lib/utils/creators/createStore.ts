import { writable } from 'svelte/store';
import type { Key } from '$lib/types';

export function createStore<T, Key>() {
	type TData = {
		[key: Key]: T;
	};

	const data = {} as TData;

	const { subscribe, set, update } = writable(data);

	// Define the store interface
	interface Store {
		subscribe: typeof subscribe;
		set: typeof set;
		update: typeof update;
		add: (item: T, key: Key) => TData;
		get: (key: Key) => T;
		delete: (key: Key) => boolean;
	}

	const store: Store = {
		subscribe,
		set,
		update,
		add: (item: T, key: Key) => {
			// Use the update method to add the item
			update((currentData) => {
				currentData[key] = item;
				return currentData;
			});
			return data;
		},
		get: (key: Key) => {
			return data[key];
		},
		delete: (key: Key) => {
			// Use the update method to delete the item by key
			let deleted = false;
			update((currentData) => {
				if (key in currentData) {
					delete currentData[key];
					deleted = true;
				}
				return currentData;
			});
			return deleted;
		}
	};

	return store;
}
