import type { Node, NodeArray, FlowChart, Edge } from '$lib/types/parser';

type Shape =
	| 'round'
	| 'square'
	| 'stadium'
	| 'subroutine'
	| 'cylindrical'
	| 'circle'
	| 'rhombus'
	| 'hexagon';
type EdgeShape = 'straight' | 'bezier';
type OpenBracket = '(' | '[' | '{';
type CloseBracket = ')' | '}' | ']';

type ShapeRef = {
	[key: string]: Shape;
};

type EdgeRef = {
	[key: string]: EdgeShape;
};

type BracketRef = Record<OpenBracket, CloseBracket>;

const shapeRef: ShapeRef = {
	'(': 'round',
	'[': 'square',
	'([': 'stadium',
	'[[': 'subroutine',
	'[(': 'cylindrical',
	'((': 'circle',
	'{': 'rhombus',
	'{{': 'hexagon'
};

const edgeRef: EdgeRef = { '-': 'straight', '~': 'bezier' };
const bracketRef: BracketRef = { '(': ')', '[': ']', '{': '}' };
const edgeRegex = /[-=~]*>(?:\s*\|(.+?)\|)?/g;

export const flowChartParser = (mermaid: string) => {
	const lines = mermaid.split('\n');

	const flowChart: FlowChart = { parentNodes: [], nodeList: {} };
	// parse mermaid string line by line
	for (const line of lines) {
		const { parentNodes, childNodes, edge } = parseLine(line);
		for (const parentNode of parentNodes) {
			// if a parent or child exists in our flow chart, then we add to their respective parent and child node arrays, otherwise we add their relational nodes then add to the flow chart
			if (!flowChart.nodeList[parentNode.id]) flowChart.parentNodes.push(parentNode);
			for (const childNode of childNodes) {
				if (flowChart.nodeList[parentNode.id]) {
					if (
						flowChart.nodeList[childNode.id] &&
						flowChart.nodeList[childNode.id].children.some(({ node }) => node.id === parentNode.id)
					) {
						throw new Error('Circular reference detected');
					}
					flowChart.nodeList[parentNode.id].children.push({
						node: flowChart.nodeList[childNode.id] || childNode,
						...edge
					});
				} else {
					parentNode.children.push({
						node: flowChart.nodeList[childNode.id] || childNode,
						...edge
					});
					flowChart.nodeList[parentNode.id] = parentNode;
				}
				if (flowChart.nodeList[childNode.id])
					flowChart.nodeList[childNode.id].parents.push({
						node: flowChart.nodeList[parentNode.id] || parentNode
					});
				else {
					childNode.parents.push({ node: flowChart.nodeList[parentNode.id] || parentNode });
					flowChart.nodeList[childNode.id] = childNode;
				}
				// remove any of the child nodes being added as a top level parent node
				flowChart.parentNodes = flowChart.parentNodes.filter((node) => node.id !== childNode.id);
			}
		}
	}
	return flowChart;
};

const parseLine = (line: string) => {
	const parentNodes: NodeArray = [];
	const childNodes: NodeArray = [];
	const trimmedLine = line.trim();
	let edgeString = '';
	// regex here will match any edge type along with its content if provided. that edge is then used to split the line into parent and child nodes
	const edgeStringArray = trimmedLine.match(edgeRegex);
	if (edgeStringArray) edgeString = edgeStringArray[0];
	else throw new Error('Invalid edge');
	const [parentNodesString, childNodesString] = trimmedLine.split(edgeString);
	for (const parentNode of parentNodesString.split('&')) parentNodes.push(nodeParser(parentNode));
	for (const childNode of childNodesString.split('&')) childNodes.push(nodeParser(childNode));
	const edge: Edge = edgeParser(edgeString);
	return { parentNodes, childNodes, edge };
};

const nodeParser = (node: string) => {
	node = node.trim();
	const id = node[0];
	const body = node.slice(1);
	let label = '';
	let shape = '';
	const type = 'Default';
	const data: Node['data'] = { shape: '' };
	const bracketStack: Array<OpenBracket> = [];

	for (let i = 0; i < body.length; i++) {
		if (isOpenBracket(body[i])) bracketStack.push(body[i] as OpenBracket);
		else if (bracketRef[bracketStack[bracketStack.length - 1]] === body[i]) {
			shape = shapeRef[bracketStack.join('')];
			break;
		} else label += body[i];
	}
	data.shape = shape;
	data.content = label;
	return { id, data, type, children: [], parents: [], depth: 0, nesting: 0 };
};

const edgeParser = (edge: string) => {
	edge = edge.trim();
	let shape = '';
	const [edgeLine, content] = edge.split('|');
	const key = edgeLine[0];
	if (key in edgeRef) shape = edgeRef[key];
	else throw new Error('Not a valid edge type');
	if (content)
		return { shape, content: content.trim(), length: Math.floor((edgeLine.trim().length - 1) / 2) };
	else return { shape, length: Math.floor((edgeLine.trim().length - 1) / 2) };
};

function isOpenBracket(key: string): key is OpenBracket {
	return key in bracketRef;
}
