import type { Writable } from 'svelte/store';

export interface XYPosition {
	x: Writable<number>;
	y: Writable<number>;
}

export interface XYPair {
	x: number;
	y: number;
}

export interface Dimensions {
	width: Writable<number>;
	height: Writable<number>;
}

export interface ActiveKeys {
	[key: string]: boolean | number;
}

export type BackgroundStyles = 'lines' | 'dots' | 'none';

export interface ActiveIntervals extends Record<string, NodeJS.Timer | undefined> {
	[key: string]: NodeJS.Timer | undefined;
}
