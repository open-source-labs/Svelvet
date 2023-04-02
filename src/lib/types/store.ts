import type { Graph, Node, DataObject, GroupBox } from '$lib/types';
import type { createStore } from '$lib/utils/';

// Usage example:
export type GraphStore = ReturnType<typeof createStore<Graph>>;
export type NodeStore = ReturnType<typeof createStore<Node>>;
export type DataStore = ReturnType<typeof createStore<DataObject>>;
export type GroupBoxStore = ReturnType<typeof createStore<GroupBox>>;

// export type GroupStore = ReturnType<typeof createStore<Writable<Group>>>;
