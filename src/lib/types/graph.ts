import type { Writable, Readable } from 'svelte/store';
import type {
	GraphKey,
	NodeStore,
	DataStore,
	Node,
	NodeKey,
	CSSColorString,
	XYPair,
	XYPosition,
	Dimensions
} from '.';

export interface Graph {
	id: GraphKey;
	nodes: NodeStore;
	transforms: GraphTransforms;
	data: DataStore;
	isLocked: Writable<boolean>;
	bounds: {
		top: Writable<number>;
		left: Writable<number>;
		right: Writable<number>;
		bottom: Writable<number>;
	};
	dimensions: Writable<DOMRect>;
	cursor: Readable<{ x: number; y: number }>;
	connectingFrom: Writable<Node | null>;
	groups: Writable<Groups>;
	edges: Writable<Edges>;
	groupProperties: Writable<{ [key: string]: GroupProperty }>;
	activeGroup: Writable<string | null>;
	initialNodePositions: Writable<XYPair[]>;
}
export type AnchorKey = `${NodeKey}-${string}`;
export type Edges = Map<AnchorKey, Connection>;

export interface Connection {
	sourceNode: Node;
	targetNode: Node;
}

export interface Groups {
	selected: Group;
	hidden: Group;
	[key: string]: Group;
}
export type Group = Writable<Set<Node>>;

export interface Bounds {
	top: Writable<number>;
	left: Writable<number>;
	width: Writable<number>;
	height: Writable<number>;
}
export interface GroupProperty {
	dimensions: Dimensions;
	position: XYPosition;
	color: Writable<CSSColorString>;
}

export interface GraphTransforms {
	translation: {
		x: Writable<number>;
		y: Writable<number>;
	};
	scale: Writable<number>;
	cursor: {
		x: Writable<number>;
		y: Writable<number>;
	};
}
