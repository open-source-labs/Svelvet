export interface SerializedNode {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	type: string;
	metadata: Record<string, unknown>;
	parentId?: string;
	zIndex: number;
	style?: Record<string, string>;
}

export interface SerializedEdge {
	id: string;
	source: string;
	target: string;
	type: string;
	metadata: Record<string, unknown>;
}

export interface SaveResult {
	success: boolean;
	graphId: string;
	stats: {
		nodes: { saved: number; failed: string[] };
		edges: { saved: number; failed: string[] };
	};
	errors?: Error[];
}
