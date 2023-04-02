import type { Writable } from 'svelte/store';
import type { Graph } from '$lib/types';

export type ContextKeys = 'snapTo' | 'graph';

export interface ContextValues {
	snapTo: number;
	graph: Graph;
}

export interface ResizeDataContext {
	heightStore: Writable<number>;
	widthStore: Writable<number>;
	minWidth: number;
	minHeight: number;
	x: Writable<number>;
	y: Writable<number>;
}
