export interface Node {
	id: string;
	data: { content?: string; shape: string; props?:string };
	type: string;
	children: Array<{ node: Node; shape: string; length: number; content?: string }>;
	parents: Array<{ node: Node }>;
	depth: number;
	nesting: number;
}

export type NodeArray = Array<Node>;

export interface FlowChart {
	parentNodes: NodeArray;
	nodeList: { [key: string]: Node };
}

export interface Edge {
	shape: string;
	content?: string;
	length: number;
}
