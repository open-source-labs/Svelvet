import type { Writable, Readable } from 'svelte/store';
import type { AnchorKey } from '$lib/types';
import type { generateOutput } from '$lib/utils';

export interface Anchor {
	// Absolute position
	// This is a derived store that is updated when the parent node is moved
	position: {
		x: Readable<number>;
		y: Readable<number>;
	};
	// Offset relative to top/left of parent node
	offset: {
		x: Writable<number>;
		y: Writable<number>;
	};
	connected: Writable<Set<Anchor>>;
	dynamic: Writable<boolean>;
	// Custom edge component if provided
	edge: ConstructorOfATypedSvelteComponent | null;
	// "Direction" of the anchor. Controls the curvature of the edge
	direction: Writable<Direction>;
	id: AnchorKey;
	type: InputType;
	inputKey: string | number | null;
	moving: Readable<boolean>;
	// An associated data store if provided
	store:
		| Writable<Record<string, Writable<unknown> | Readable<unknown>>>
		| ReturnType<typeof generateOutput>
		| null;
}

export type Direction = 'north' | 'south' | 'east' | 'west' | 'self';

export type InputType = 'input' | 'output' | null;
