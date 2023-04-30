import type { Writable } from 'svelte/store';
import type { AnchorStore, CSSDimensionString, InitialDimensions, Connections, Direction } from '.';
import type { XYPair, NodeKey, Dimensions, CSSColorString, GroupKey } from '.';
import type { ComponentType } from 'svelte';
// This defines an interface for the actual node object that is used in the graph/stores
export interface Node {
	id: NodeKey;
	label: Writable<string>; // Primary label for default node
	dimensions: Dimensions;
	rotation: Writable<number>;
	position: Writable<XYPair>;
	inputs: Writable<number>; //Number of default input anchors to render
	outputs: Writable<number>; // Number of default output anchors to render
	anchors: AnchorStore;
	group: Writable<GroupKey | null>;
	collapsed: Writable<boolean>;
	visible: Writable<boolean>;
	resizingWidth: Writable<boolean>;
	resizingHeight: Writable<boolean>;
	moving: Writable<boolean>;
	rotating: Writable<boolean>;
	editable: Writable<boolean>;
	locked: Writable<boolean>;
	recalculateAnchors: (direction?: Direction) => void;
	selectable: Writable<boolean>;
	connectable: Writable<boolean>;
	collapsible: Writable<boolean>;
	deletable: Writable<boolean>;
	hideable: Writable<boolean>;
	focusable: Writable<boolean>;
	resizable: Writable<boolean>;
	zIndex: Writable<number>;
	edge: ComponentType | null;
	ariaLabel: string;
	direction: Writable<'TD' | 'LR'>;
	borderRadius: Writable<number>;
	borderWidth: Writable<number>;
	connections: Writable<Array<Connections>>;
	bgColor: Writable<CSSColorString | null>;
	borderColor: Writable<CSSColorString | null>;
	selectionColor: Writable<CSSColorString | null>;
	textColor: Writable<CSSColorString | null>;
}

// This defines an interface for the node object
// Passed to the createNode function
export interface NodeConfig {
	id?: string | number;
	dimensions?: InitialDimensions;
	position?: {
		x: number;
		y: number;
	};
	direction?: 'TD' | 'LR';
	zIndex?: number;
	label?: string;
	group?: GroupKey;
	editable?: boolean;
	resizable?: boolean;
	inputs?: number;
	outputs?: number;
	locked?: boolean;
	selectionColor?: CSSColorString;
	component?: ComponentType;
	width?: number;
	height?: number;
	header?: true;
	props?: object;
	borderColor?: CSSColorString;
	bgColor?: CSSColorString;
	useDefaults?: boolean;
	borderRadius?: number;
	borderWidth?: number;
	rotation?: number;
	textColor?: CSSColorString;
	connections?: Array<Connections>;
	edge?: ComponentType;
}

export type UserDimension = number | CSSDimensionString;

export type WritableNode = Writable<Node>;
