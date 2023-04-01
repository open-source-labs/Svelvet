import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Key } from '$lib/types';

export function createStore<T extends { id: Key }>() {
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
		add: (item: T) => TData;
		get: (key: Key) => T;
	}

	const store: Store = {
		subscribe,
		set,
		update,
		add: (item: T) => {
			data[item.id] = item;
			return data;
		},
		get: (key: Key) => {
			return data[key];
		}
	};

	return store;
}
