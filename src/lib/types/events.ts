import type { Node, Anchor } from '$lib/types';

export interface SvelvetConnectionEvent {
	sourceNode: Node;
	sourceAnchor: Anchor;
	targetNode: Node;
	targetAnchor: Anchor;
}

export interface AnchorConnectionEvent {
	node: Node;
	anchor: Anchor;
	connectedNode: Node;
	connectedAnchor: Anchor;
}
