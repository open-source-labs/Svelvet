import type {
	NodeProps,
	AnchorProps,
	EdgeProps,
	NodeConfig,
	AnchorDrawerConfig,
	EdgeDrawerConfig
} from '$lib/types';

export function addProps(
	propNames: string[],
	propValues: NodeProps | AnchorProps | EdgeProps,
	propObject: NodeConfig | AnchorDrawerConfig | EdgeDrawerConfig | any
): void {
	for (let i = 0; i < propNames.length; i++) {
		if (propValues[i] !== undefined) propObject[propNames[i]] = propValues[i];
	}
}
