import type { Writable } from 'svelte/store';

export type ContextKeys = 'snapTo' | 'graphId';

export interface ContextValues {
	snapTo: number;
	graphId: string;
}

export type SetContext = <T extends ContextKeys>(key: T, value: ContextValues[T]) => void;
export type GetContext = <T extends ContextKeys>(key: T) => ContextValues[T];
