import type { CSSColorString } from './general';

export type ParameterConfig = SliderConfig | RadioConfig;

export interface SliderConfig {
	id: string;
	type: 'slider';
	initial: number;
	label: string;
	min?: number;
	max?: number;
	step?: number;
	rounding?: number;
	connection?: string | null;
}

export interface RadioConfig {
	id: string;
	type: 'radio';
	initial: number;
	label: string;
	options: string[];
	connection?: string | null;
}

export interface ColorConfig {
	initial: CSSColorString;
}
