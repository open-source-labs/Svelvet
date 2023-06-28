import { writable } from 'svelte/store';
import type { Store } from '$lib/types';

export function createStore<T, K>(): Store<T, K> {
	type TData = Map<K, T>;

	const data = new Map() as TData;

	const { subscribe, set, update } = writable(data);

	const store: Store<T, K> = {
		subscribe,
		set,
		update,
		add: (item: T, key: K) => {
			update((currentData) => {
				currentData.set(key, item);
				return currentData;
			});
			return data;
		},
		get: (key: K) => {
			return data.get(key) || null;
		},
		getAll: () => {
			return Array.from(data.values());
		},
		delete: (key: K) => {
			let deleted = false;
			update((currentData) => {
				currentData.delete(key);
				deleted = true;

				return currentData;
			});
			return deleted;
		},
		count: () => data.size
	};

	return store;
}
