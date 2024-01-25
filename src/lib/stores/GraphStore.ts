import type { Graph, GraphKey } from '$lib/types';
import { createStore } from '$lib/utils';
import { writable } from 'svelte/store';

export const graphStore = createStore<Graph, GraphKey>();

export const source = writable(null);

// create new graph store, less strict type check
// export const graphStore = writable<Graph | null>(null);
