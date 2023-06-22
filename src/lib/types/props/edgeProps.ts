import type { CSSColorString } from '$lib/types';

export interface EdgeDrawerConfig {
	width?: number;
	targetColor?: CSSColorString;
	color?: CSSColorString;
	straight?: boolean;
	step?: boolean;
	cornerRadius?: number;
	animate?: false;
	label?: string;
	labelColor?: CSSColorString;
	textColor?: CSSColorString;
}

export type EdgeProps = [
	width: number | undefined,
	targetColor: CSSColorString | undefined,
	color: CSSColorString | undefined,
	straight: boolean | undefined,
	step: boolean | undefined,
	cornerRadius: number | undefined,
	animate: boolean | undefined,
	label: string | undefined,
	labelColor: CSSColorString | undefined,
	textColor: CSSColorString | undefined
];
