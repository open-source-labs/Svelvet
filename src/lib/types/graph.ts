import type { Writable, Readable } from 'svelte/store';
import type {
	GraphKey,
	NodeStore,
	Node,
	CSSColorString,
	XYPair,
	Dimensions,
	GroupBoxStore,
	EdgeStore,
	GroupKey,
	Anchor,
	InputStore,
	OutputStore,
	GraphDimensions,
	Theme
} from '.';
import type { ComponentType } from 'svelte';

export interface Graph {
	id: GraphKey;
	nodes: NodeStore;
	transforms: GraphTransforms;
	locked: Writable<boolean>;
	bounds: {
		graphBounds: Writable<{
			top: number;
			left: number;
			right: number;
			bottom: number;
		}>;
		nodeBounds: Writable<{
			top: number;
			left: number;
			right: number;
			bottom: number;
		}>;
	};
	mounted: Writable<boolean>;
	center: Readable<XYPair>;
	maxZIndex: Writable<number>;
	dimensions: Writable<GraphDimensions>;
	editable: boolean;
	direction: 'TD' | 'LR';
	cursor: Readable<{ x: number; y: number }>;
	groups: Writable<Groups>;
	edges: EdgeStore;
	edge: ComponentType | null;
	groupBoxes: GroupBoxStore;
	editing: Writable<Node | null>;
	activeGroup: Writable<GroupKey | null>;
	initialNodePositions: Writable<XYPair[]>;
}

// Props for Svelvet component
export interface GraphConfig {
	editable?: boolean;
	zoom?: number;
	direction?: 'TD' | 'LR';
	locked?: boolean;
	theme?: Theme;
	translation?: { x: number; y: number };
	edge?: ComponentType;
}

export type LinkingAny = Anchor;

export interface LinkingInput {
	anchor: Anchor;
	store: InputStore | null;
	key: string | number | null;
}

export interface LinkingOutput {
	anchor: Anchor;
	store: OutputStore | null;
}

export interface ConnectingFrom {
	anchor: Anchor;
	store: InputStore | OutputStore | null;
	key: string | number | null;
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
	group: Writable<GroupKey>;
	dimensions: Dimensions;
	position: Writable<XYPair>;
	color: Writable<CSSColorString>;
	moving: Writable<boolean>;
}

export interface Group {
	parent: Writable<Node | GroupBox | null>;
	nodes: Writable<Set<Node | GroupBox>>;
}

export interface GraphTransforms {
	translation: Writable<XYPair>;
	scale: Writable<number>;
}
