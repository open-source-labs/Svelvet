import type { Writable } from 'svelte/store';
import type { Anchor, NodeKey, InputKey, OutputKey, CSSColorString, EmValue, EdgeKey } from '.';
import type { PixelValue, RemValue } from '.';
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
	id: EdgeKey;
	source: Anchor | null;
	target: Anchor | null;
	type: Writable<EdgeStyle>;
	color: Writable<CSSColorString>;
	width: Writable<number>;
	label?: EdgeLabel;
	animated: Writable<boolean>;
};

export interface EdgeLabel {
	text: Writable<string>;
	color: Writable<CSSColorString>;
	textColor: Writable<CSSColorString>;
	fontSize: Writable<PixelValue | RemValue | EmValue>;
	dimensions: {
		width: Writable<number>;
		height: Writable<number>;
	};
	borderRadius: Writable<number>;
}

export interface EdgeConfig {
	type?: EdgeStyle;
	color?: CSSColorString;
	width?: number;
	label?: EdgeLabelConfig;
	animated?: boolean;
}

export interface EdgeLabelConfig {
	text: string;
	color?: CSSColorString;
	textColor?: CSSColorString;
	fontSize?: PixelValue | RemValue;
	dimensions?: {
		width: number;
		height: number;
	};
	borderRadius?: number;
}
