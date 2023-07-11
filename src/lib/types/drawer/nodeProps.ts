import type { AnchorDrawerConfig, EdgeDrawerConfig ,CSSColorString } from '$lib/types';

export interface NodeDrawerConfig {
	bgColor?: CSSColorString;
	borderColor?: CSSColorString;
	label?: string;
	width?: number;
	height?: number;
	locked?: boolean;
	center?: boolean;
	inputs?: number;
	outputs?: number;
	rotation?: number;
	zIndex?: number;
	TD?: boolean;
	LR?: boolean;
	useDefaults?: boolean;
	nodeDirection?: string;
	anchors?: {[key:string]: AnchorDrawerConfig[]};
	edgeProps?: EdgeDrawerConfig;
}

export type NodeProps = [
	bgColor: CSSColorString | undefined,
	borderColor: CSSColorString | undefined,
	label: string | undefined,
	width: number,
	height: number,
	locked: boolean | undefined,
	center: boolean | undefined,
	inputs: number | undefined,
	outputs: number | undefined,
	rotation: number | undefined,
	zIndex: number | undefined,
	TD: boolean | undefined,
	LR: boolean | undefined,
	useDefaults: boolean | undefined
];
