import type { Writable } from 'svelte/store';
import type { AnchorStore, CSSDimensionString } from '.';
import type { XYPosition, NodeKey, Dimensions, ConfigObject, CSSColorString, GroupKey } from '.';

// This defines an interface for the actual node object that is used in the graph/stores
export interface Node {
	id: NodeKey;
	label: Writable<string>; // Primary label for default node
	dimensions: Dimensions;
	position: XYPosition;
	inputs: Writable<number>; //Number of default input anchors to render
	anchors: AnchorStore;
	properties: Writable<Properties>;
	processor: (inputs: Inputs, properties: Properties) => void;
	outputs: Writable<number>; // Number of default output anchors to render
	header: Writable<boolean>;
	group: Writable<GroupKey | null>;
	collapsed: Writable<boolean>;
	visible: Writable<boolean>;
	resizingWidth: Writable<boolean>;
	resizingHeight: Writable<boolean>;
	moving: Writable<boolean>;
	editable: Writable<boolean>;
	draggable: Writable<boolean>;
	selectable: Writable<boolean>;
	connectable: Writable<boolean>;
	collapsible: Writable<boolean>;
	deletable: Writable<boolean>;
	hideable: Writable<boolean>;
	focusable: Writable<boolean>;
	resizable: Writable<boolean>;
	props: object | null;
	zIndex: Writable<number>;
	ariaLabel: string;
	component: ConstructorOfATypedSvelteComponent | null;
	config?: ConfigObject;
	direction: 'horizontal' | 'vertical';
	headerHeight: Writable<number>;
	borderRadius: Writable<number>;
	bgColor: Writable<CSSColorString | null>;
	borderColor: Writable<CSSColorString | null>;
	textColor: Writable<CSSColorString | null>;
	headerColor: Writable<CSSColorString | null>;
}

// This defines an interface for the user-defined node object
// Passed to the createNode function
export interface NodeConfig {
	id?: string | number;
	dimensions?: {
		width: number;
		height: number;
	};
	position?: {
		x: number;
		y: number;
	};
	direction?: 'horizontal' | 'vertical';
	label?: string;
	group?: string;
	resizable?: boolean;
	inputs?: number;
	outputs?: number;
	component?: ConstructorOfATypedSvelteComponent;
	config?: ConfigObject;
	width?: number;
	height?: number;
	header?: true;
	props?: object;
	borderColor?: CSSColorString;
	bgColor?: CSSColorString;
	borderRadius?: number;
	borderWidth?: number;
	textColor?: CSSColorString;
	headerColor?: CSSColorString;
	sourcePostion?: 'top' | 'bottom' | 'left' | 'right';
	targetPostion?: 'top' | 'bottom' | 'left' | 'right';
	clickCallback?: (node: Node) => void;
}

export type UserDimension = number | CSSDimensionString;

export type Properties = Record<string, Writable<Parameter>>;

export type WritableNode = Writable<Node>;

export type Parameter = number | string | object | boolean;

export type Inputs = Record<string, Writable<Parameter>>;

export interface Output {
	id: string;
	label: string;
	value: Writable<Parameter | null>;
}
export interface AnchorGroup {
	id?: string;
	label?: string;
	count?: number;
	side: 'top' | 'bottom' | 'left' | 'right';
	align: 'start' | 'end' | 'center';
	gap?: number;
	offset?: { x?: number; y?: number };
	component?: ConstructorOfATypedSvelteComponent;
}

export type Outputs = Record<string, Output>;
