import type { Writable, Readable } from 'svelte/store';
import type { AnchorKey } from '$lib/types';
import type { generateOutput } from '$lib/utils';

export interface Anchor {
	position: {
		x: Readable<number>;
		y: Readable<number>;
	};
	offset: {
		x: Writable<number>;
		y: Writable<number>;
	};
	connected: Writable<Set<Anchor>>;
	dynamic: Writable<boolean>;
	edge: ConstructorOfATypedSvelteComponent | null;
	direction: Writable<Direction>;
	id: AnchorKey;
	type: InputType;
	moving: Readable<boolean>;
	store:
		| Writable<Record<string, Writable<unknown> | Readable<unknown>>>
		| ReturnType<typeof generateOutput>
		| null;
}

export type Direction = 'north' | 'south' | 'east' | 'west' | 'self';

export type InputType = 'input' | 'output' | null;
