import type { Writable } from 'svelte/store';
import type { NodeKey, InputKey, OutputKey, CSSColorString } from '.';

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

// With writable properties
export type WritableEdge = {
	target: {
		node: Writable<NodeKey>;
		input: Writable<InputKey>;
	};
	source: {
		node: Writable<NodeKey>;
		output: Writable<OutputKey>;
	};
	type: Writable<EdgeStyle>;
	color: Writable<CSSColorString>;
	width: Writable<number>;
	label?: {
		text: Writable<string>;
		color: Writable<CSSColorString>;
		textColor: Writable<CSSColorString>;
		fontSize: Writable<number>;
		dimensions: {
			width: Writable<number>;
			height: Writable<number>;
		};
		borderRadius: Writable<number>;
	};
	animated: Writable<boolean>;
};
