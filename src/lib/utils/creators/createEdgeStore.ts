import { writable } from 'svelte/store';
import type { Anchor, Node, WritableEdge, EdgeStore, CustomEdgeKey } from '$lib/types';

export function createEdgeStore(): EdgeStore {
	type TData = Map<CustomEdgeKey, WritableEdge>;

	const data = new Map() as TData;
	const subscribersOnChange = new Set<
		(edge: WritableEdge, type: 'connection' | 'disconnection') => void
	>();

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

				subscribersOnChange.forEach((subscriber) => subscriber(item, 'connection'));
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
		fetch: (source: Anchor, target: Anchor) => {
			const match = Array.from(data.keys()).filter((key) => {
				if (key === 'cursor') return false;
				return [source, target].every((arg) => {
					if (!arg) return true;
					return key.has(arg);
				});
			})[0];
			// return matches.map((key) => data.get(key) as WritableEdge);
			return data.get(match) || null;
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
				const edge = currentData.get(key);
				if (!edge) return currentData;
				currentData.delete(key);
				deleted = true;
				if (typeof key !== 'string')
					subscribersOnChange.forEach((subscriber) => subscriber(edge, 'disconnection'));
				return currentData;
			});
			return deleted;
		},
		onEdgeChange: (
			subscriber: (edge: WritableEdge, type: 'connection' | 'disconnection') => void
		) => {
			subscribersOnChange.add(subscriber);

			// Return an unsubscribe function
			return () => subscribersOnChange.delete(subscriber);
		},
		count: () => data.size
	};

	return store;
}
