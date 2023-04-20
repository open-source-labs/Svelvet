import { writable } from 'svelte/store';
import type { GenericKey, Store } from '$lib/types';

export function createStore<T, K extends GenericKey>(): Store<T, K> {
	type TData = Record<K, T>;

	const data = {} as TData;

	const { subscribe, set, update } = writable(data);
	let count = 0;

	const store: Store<T, K> = {
		subscribe,
		set,
		update,
		add: (item: T, key: K) => {
			update((currentData) => {
				currentData[key] = item;
				count++;
				return currentData;
			});
			return data;
		},
		get: (key: K) => {
			if (data[key]) return data[key];
			return null;
		},
		delete: (key: K) => {
			let deleted = false;
			update((currentData) => {
				if (key in currentData) {
					delete currentData[key];
					deleted = true;
					count--;
				}
				return currentData;
			});
			return deleted;
		},
		count: () => count
	};

	return store;
}
