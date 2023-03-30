import type { Writable } from 'svelte/store';
import type { derived } from 'svelte/store';
import type { XYPosition, NodeKey, XYPair, Dimensions, ConfigObject, CSSColorString } from '.';

// This defines an interface for the actual node object that is used in the graph/stores
export interface Node {
	id: NodeKey;
	dimensions: Dimensions;
	position: XYPosition;
	inputs: Writable<Inputs>;
	anchors: Record<string, XYPair>;
	properties: Writable<Properties>;
	processor: (inputs: Inputs, properties: Properties) => void;
	outputs: Writable<Parameter>;
	group: Writable<string | null>;
	collapsed: Writable<boolean>;
	visible: Writable<boolean>;
	draggable: Writable<boolean>;
	selectable: Writable<boolean>;
	connectable: Writable<boolean>;
	deletable: Writable<boolean>;
	zIndex: Writable<number>;
	ariaLabel: string;
	header?: true;
	focusable: Writable<boolean>;
	resizing: Writable<boolean>;
	componentRef: string;
	config?: ConfigObject;
	borderRadius?: number;
	label?: string;
	bgColor?: CSSColorString;
	borderColor?: CSSColorString;
	textColor?: CSSColorString;
}

export interface DummyNode {
	id?: never;
	anchors: Record<string, XYPair>;
	position: XYPosition;
	dimensions: Dimensions;
}

// This defines an interface for the user-defined node object
// Passed to the createNode function
export interface NodeConfig {
	id: NodeKey;
	dimensions?: {
		width: number;
		height: number;
	};
	position?: {
		x: number;
		y: number;
	};
	data?: object;
	group?: string;
	inputs?: Inputs;
	outputs?: Outputs;
	componentRef?: string;
	config?: ConfigObject;
	width?: number;
	height?: number;
	header?: true;
	borderColor?: CSSColorString;
	bgColor?: CSSColorString;
	borderRadius?: number;
	borderWidth?: number;
	textColor?: CSSColorString;
	sourcePostion?: 'top' | 'bottom' | 'left' | 'right';
	targetPostion?: 'top' | 'bottom' | 'left' | 'right';
	clickCallback?: (node: Node) => void;
}

export type Properties = Record<string, Writable<Parameter>>;

export type WritableNode = Writable<Node>;

export type Parameter = number | string | object | boolean;

export type Inputs = Record<string, Writable<Parameter>>;

export interface Output {
	id: string;
	label: string;
	value: Writable<Parameter | null>;
}
export type Outputs = Record<string, Output>;
