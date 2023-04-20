import { writable, type Writable } from 'svelte/store';
import type { GenericKey } from '$lib/types';

export function createStore<T, K extends GenericKey>(): {
	subscribe: Writable<Record<K, T>>['subscribe'];
	set: Writable<Record<K, T>>['set'];
	update: Writable<Record<K, T>>['update'];
	add: (item: T, key: K) => Record<K, T>;
	get: (key: K) => T;
	delete: (key: K) => boolean;
	count: () => number;
} {
	type TData = Record<K, T>;

	const data = {} as TData;

	const { subscribe, set, update } = writable(data);
	let count = 0;

	interface Store {
		subscribe: typeof subscribe;
		set: typeof set;
		update: typeof update;
		add: (item: T, key: K) => TData;
		get: (key: K) => T;
		delete: (key: K) => boolean;
		count: () => number;
	}

	const store: Store = {
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
			return data[key];
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
		count: () => {
			return count;
		}
	};

	return store;
}
