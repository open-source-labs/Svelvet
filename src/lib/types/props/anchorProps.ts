import type { CSSColorString, Direction } from '$lib/types';
import type { ComponentType } from 'svelte';

export interface AnchorDrawerConfig {
	invisible?: boolean;
	nodeConnect?: boolean;
	input?: boolean;
	output?: boolean;
	multiple?: boolean;
	direction?: Direction;
	dynamic?: boolean;
	anchorEdgeLabel?: string;
	anchorLocked?: boolean;
	anchorBgColor?: CSSColorString;
}

export type AnchorProps = [
	invisible: boolean | undefined,
	nodeConnect: boolean | undefined,
	input: boolean | undefined,
	output: boolean | undefined,
	multiple: boolean | undefined,
	direction: Direction | undefined,
	dynamic: boolean | undefined,
	anchorEdgeLabel: string | undefined,
	anchorLocked: boolean | undefined,
	anchorBgColor: CSSColorString | undefined,
	edge: ComponentType | undefined
];
