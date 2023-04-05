import type { Writable, Readable } from 'svelte/store';
import type { InputKey, OutputKey } from '$lib/types';

export interface Anchor<Input extends boolean> {
	position: {
		x: Readable<number>;
		y: Readable<number>;
	};
	offset: {
		x: Writable<number>;
		y: Writable<number>;
	};
	dynamic: Writable<boolean>;
	direction: Writable<Direction>;
	id: Input extends true ? InputKey : OutputKey;
	input: Input;
}

export type Direction = 'north' | 'south' | 'east' | 'west' | 'self';
