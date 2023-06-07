import type { CSSColorString } from '$lib/types';

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
