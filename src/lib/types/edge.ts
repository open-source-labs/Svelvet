import type { Writable, Readable } from 'svelte/store';
import type { Anchor, CSSColorString, EmValue, EdgeKey, CustomWritable } from '.';
import type { PixelValue, RemValue } from '.';
import type { generateOutput } from '$lib/utils/creators/generateOutput';
export type EdgeStyle = 'straight' | 'step' | 'bezier';

// With writable properties
export type WritableEdge = {
	id: EdgeKey;
	source: Anchor | null;
	target: Anchor | null;
	type: Writable<EdgeStyle>;
	color:
		| Writable<CSSColorString | null>
		| CustomWritable<CSSColorString>
		| Readable<CSSColorString>;
	width: Writable<number>;
	label?: EdgeLabel;
	animated: Writable<boolean>;
	component: ConstructorOfATypedSvelteComponent | null;
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
	color?:
		| Writable<CSSColorString | null>
		| CustomWritable<CSSColorString>
		| Readable<CSSColorString>;
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

export type StepDirection = 'left' | 'right' | 'up' | 'down';

export type ArcKey = '1001' | '0110' | '100-1' | '0-110' | '-1001' | '0110' | '-100-1' | '0-110';
