export interface SvelvetNode {
	id: string;
	x: number;
	y: number;
	width?: number;
	height?: number;
	type?: string;
	data?: Record<string, any>;
	parentId?: string;
}

export interface SvelvetEdge {
	id: string;
	source: string;
	target: string;
	type?: string;
	data?: Record<string, any>;
}

export interface GraphSaveResult {
	success: boolean;
	nodes: {
		saved: number;
		failed: string[];
	};
	edges: {
		saved: number;
		failed: string[];
	};
	errors?: Error[];
}
