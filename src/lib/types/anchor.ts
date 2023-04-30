import type { Writable, Readable } from 'svelte/store';
import type { AnchorKey, CSSColorString, CustomWritable, Node, XYPair } from '$lib/types';
import type { generateOutput } from '$lib/utils';
import type { ComponentType } from 'svelte';

export interface Anchor {
	id: AnchorKey;
	// Absolute position
	// This is a derived store that is updated when the parent node is moved
	position: Readable<{
		x: number;
		y: number;
	}>;
	// Offset relative to top/left of parent node
	offset: Writable<XYPair>;
	connected: Writable<Set<Anchor>>;
	dynamic: Writable<boolean>;
	// Custom edge component if provided
	edge: ComponentType | null;
	// "Direction" of the anchor. Controls the curvature of the edge
	direction: Writable<Direction>;
	rotation: Readable<number>;
	recalculatePosition: () => void;
	type: InputType;
	inputKey: string | number | null;
	moving: Readable<boolean>;
	edgeColor:
		| Writable<CSSColorString | null>
		| CustomWritable<CSSColorString>
		| Readable<CSSColorString>;
	// An associated data store if provided
	store:
		| Writable<Record<string, Writable<unknown> | Readable<unknown>>>
		| ReturnType<typeof generateOutput>
		| null;
	node: Node;
}

export type Direction = 'north' | 'south' | 'east' | 'west' | 'self';

export type InputType = 'input' | 'output' | null;
