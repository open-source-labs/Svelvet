import type { Graph, Node, DataObject, Group, GroupProperty } from '.';
import type { createStore } from '$lib/utils/createStore';
import type { Writable } from 'svelte/store';
// Usage example:
export type GraphStore = ReturnType<typeof createStore<Graph>>;
export type NodeStore = ReturnType<typeof createStore<Node>>;
export type DataStore = ReturnType<typeof createStore<DataObject>>;

// export type GroupStore = ReturnType<typeof createStore<Writable<Group>>>;
