import type { Writable, Readable } from 'svelte/store';
import type {
	GraphKey,
	NodeStore,
	Node,
	CSSColorString,
	XYPair,
	XYPosition,
	Dimensions,
	GroupBoxStore,
	EdgeStore,
	OutputKey,
	GroupKey,
	Anchor,
	Parameter
} from '.';

export interface Graph {
	id: GraphKey;
	nodes: NodeStore;
	transforms: GraphTransforms;
	isLocked: Writable<boolean>;
	bounds: {
		top: Writable<number>;
		left: Writable<number>;
		right: Writable<number>;
		bottom: Writable<number>;
	};
	connectingStore: Writable<Writable<Parameter> | null>;
	maxZIndex: Writable<number>;
	dimensions: Writable<DOMRect>;
	cursor: Readable<{ x: number; y: number }>;
	connectingFrom: Writable<Anchor<false> | Anchor<true> | null>;
	outputsRemoved: Writable<Set<OutputKey>>;
	groups: Writable<Groups>;
	edges: EdgeStore;
	groupBoxes: GroupBoxStore;
	editing: Writable<Node | null>;
	activeGroup: Writable<GroupKey | null>;
	initialNodePositions: Writable<XYPair[]>;
}

export type Groups = Record<GroupKey, Group>;

export interface Bounds {
	top: Writable<number>;
	left: Writable<number>;
	width: Writable<number>;
	height: Writable<number>;
}

export type GroupBoxes = Record<GroupKey, GroupBox>;

export interface GroupBox {
	id: string;
	dimensions: Dimensions;
	position: XYPosition;
	color: Writable<CSSColorString>;
}

export interface Group {
	parent: Writable<Node | GroupBox | null>;
	nodes: Writable<Set<Node>>;
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
