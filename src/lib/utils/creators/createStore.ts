import { writable } from 'svelte/store';
import type { Store, Anchor, Node, WritableEdge, EdgeStore, CursorAnchor } from '$lib/types';

export type CustomEdgeKey = Set<Anchor | Node> | 'cursor';

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

export function createEdgeStore(): EdgeStore {
	type TData = Map<CustomEdgeKey, WritableEdge>;

	const data = new Map() as TData;

	const { subscribe, set, update } = writable(data);

	const store = {
		subscribe,
		set,
		update,
		add: (item: WritableEdge, key: CustomEdgeKey) => {
			if (typeof key !== 'string') {
				const elements = Array.from(key as Set<Node | Anchor>);
				const anchor1 = elements[0] as Anchor;
				const anchor2 = elements[1] as Anchor;
				anchor1.connected.update((anchors) => anchors.add(anchor2));
				anchor2.connected.update((anchors) => anchors.add(anchor1));
				if (store.match(...Array.from(key as Set<Node | Anchor>)).length) return;
			}

			update((currentData) => {
				currentData.set(key, item);
				return currentData;
			});
			return;
		},
		getAll: () => {
			return Array.from(data.values());
		},
		get: (key: CustomEdgeKey) => {
			return data.get(key) || null;
		},
		match: (...args: Array<Node | Anchor | null>) => {
			return Array.from(data.keys()).filter((key) => {
				if (key === 'cursor') return false;
				return args.every((arg) => {
					if (!arg) return true;
					return key.has(arg);
				});
			});
		},
		delete: (key: CustomEdgeKey) => {
			if (typeof key !== 'string') {
				const elements = Array.from(key as Set<Node | Anchor>);

				const anchor1 = elements[0] as Anchor;
				const anchor2 = elements[1] as Anchor;
				anchor1.connected.update((anchors) => {
					anchors.delete(anchor2);
					return anchors;
				});
				anchor2.connected.update((anchors) => {
					anchors.delete(anchor1);
					return anchors;
				});
			}
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
