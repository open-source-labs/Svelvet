import type { Writable } from 'svelte/store';
import type { derived } from 'svelte/store';
import type { XYPosition, NodeKey, Dimensions, ConfigObject } from '.';

export interface Node {
	id: NodeKey;
	dimensions: Dimensions;
	position: XYPosition;
	inputs: Writable<Inputs>;
	anchors: {
		[key: string]: {
			x: number;
			y: number;
		};
	};
	properties: Writable<Properties>;
	processor: (inputs: Inputs, properties: Properties) => void;
	outputs: ReturnType<typeof derived>;
	group: Writable<string | null>;
	collapsed: Writable<boolean>;
	hidden: Writable<boolean>;
	draggable: Writable<boolean>;
	selectable: Writable<boolean>;
	connectable: Writable<boolean>;
	deletable: Writable<boolean>;
	zIndex: Writable<number>;
	ariaLabel: string;
	focusable: Writable<boolean>;
	resizing: Writable<boolean>;
	componentRef: string;
	config?: ConfigObject;
}

export type Property = any;
export type Properties = Record<string, Input>;

export interface UserProperty {
	id: string;
	label: string;
	type: string;
	input: null | string;
	initial: unknown;
	min?: number;
	max?: number;
	step?: number;
	rounding?: number;
}

export interface UserProperties {
	[key: string]: UserProperty;
}

export type WritableNode = Writable<Node>;

export type Input = any;
export type Inputs = Record<string, Input>;

export interface Output {
	id: string;
	label: string;
	value: Writable<unknown | null>;
}
export type Outputs = Record<string, Output>;
