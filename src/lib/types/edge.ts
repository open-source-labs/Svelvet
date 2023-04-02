import type { Writable } from 'svelte/store';
import type { Node, NodeKey, InputKey, OutputKey, CSSColorString } from '.';

export type EdgeStyle = 'straight' | 'smoothstep' | 'step' | 'bezier';

// Object structure for store
export interface Edge {
	target:
		| {
				node: NodeKey;
				input?: InputKey;
		  }
		| string
		| number;
	source:
		| string
		| number
		| {
				node: NodeKey;
				output?: OutputKey;
		  };
	type?: EdgeStyle;
	color?: CSSColorString;
	width?: number;
	label?:
		| string
		| {
				text: string;
				color?: CSSColorString;
				textColor?: CSSColorString;
				fontSize?: number;
				dimensions?: {
					width: number;
					height: number;
				};
				borderRadius?: number;
		  };

	animated?: boolean;

	// Old version for compatibility
	id?: string | number;
	sourceAnchorCb?: () => void;
	targetAnchorCb?: () => void;
	labelBgColor?: CSSColorString;
	labelTextColor?: CSSColorString;
	edgeColor?: CSSColorString;
	animate?: boolean;
	noHandle?: boolean;
	arrow?: boolean;
	clickCallback?: () => void;
	className?: string;
}
export type CSSDimensions = `${number}px}` | `${number}%`;

// With writable properties
export type WritableEdge = {
	target: {
		node: Writable<Node>;
		input: Writable<InputKey>;
	};
	source: {
		node: Writable<Node>;
		output: Writable<OutputKey>;
	};
	type: Writable<EdgeStyle>;
	color: Writable<CSSColorString>;
	width: Writable<string>;
	label?: {
		text: Writable<string>;
		color: Writable<CSSColorString>;
		textColor: Writable<CSSColorString>;
		fontSize: Writable<string>;
		dimensions: {
			width: Writable<string>;
			height: Writable<string>;
		};
		borderRadius: Writable<string>;
	};
	animated: Writable<boolean>;
};

export interface Connection {
	source: Node;
	target: Node;
	input: InputKey;
	output: OutputKey;
}

export interface EdgeConfig {
	type?: EdgeStyle;
	color?: CSSColorString;
	width?: number;
	label?: EdgeLabel;
	animated?: boolean;
}

export interface EdgeLabel {
	text: string;
	color?: CSSColorString;
	textColor?: CSSColorString;
	fontSize?: number;
	dimensions?: {
		width: number;
		height: number;
	};
	borderRadius?: number;
}
