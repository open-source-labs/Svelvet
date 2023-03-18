import type { Writable } from 'svelte/store';
import type { XYPosition, ConfigObject, NodeKey, Dimensions } from '.';

export interface Node {
	id: NodeKey;
	dimensions: Dimensions;
	position: XYPosition;
	inputNodes: Writable<Set<Node>>;
	outputNodes: Writable<Set<Node>>;
	collapsed?: Writable<boolean>;
	hidden?: Writable<boolean>;
	selected?: Writable<boolean>;
	draggable?: Writable<boolean>;
	selectable?: Writable<boolean>;
	connectable?: Writable<boolean>;
	deletable?: Writable<boolean>;
	zIndex?: Writable<number>;
	ariaLabel?: string;
	focusable?: Writable<boolean>;
	resizing?: Writable<boolean>;
	componentRef?: string;
	configObject?: Writable<ConfigObject>;
}

export type WritableNode = Writable<Node>;
