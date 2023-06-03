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
	propObject: Record<string, NodeConfig | AnchorDrawerConfig | EdgeDrawerConfig>
	// | NodeConfig
	// | AnchorDrawerConfig
	// | EdgeDrawerConfig
): void {
	for (let i = 0; i < propNames.length; i++) {
		if (propValues[i] !== undefined) propObject[propNames[i]] = propValues[i];
	}
}
