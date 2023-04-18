import { createNode } from '$lib/utils';

import type { Node, NodeConfig } from '$lib/types';
import type { FlowChart, Node as FlowChartNode } from '$lib/types/parser';
import { writable } from 'svelte/store';

interface Nodes {
	[key: string]: Node;
}

type LayerNode = {
	id: string;
	children: Array<string>;
	parents: Array<string>;
	layer: number;
	type?: string;
	propsId?: string;
	ignore?: boolean;
};

interface LayerTracker {
	[key: number]: Array<LayerNode>;
}

const directionRef: { [key: string]: number } = { td: 0, tb: 0, lr: 1, bt: 2, bu: 2, rl: 3 };

const nodes: Nodes = {};

export function flowChartDrawer(flowChart: FlowChart, direction: 'td' | 'bt' | 'lr' | 'rl') {
	flowChart.parentNodes.forEach((node) => assignNodeDepthAndNesting(node));
	const [layerTracker, maxLayer] = layerAssignment(flowChart);
	populateGhostNodes(layerTracker, flowChart);
	balanceLayers(layerTracker);
	for (let i = 0; i < 10; i++) {
		let nodeWasSwapped = false;
		for (let j = 0; j <= maxLayer; j++) {
			if (!layerTracker[j]) continue;
			for (let k = 0; k < layerTracker[j].length; k++) {
				const node = layerTracker[j][k];
				const bestSwapIndex = findBestSwapIndex(layerTracker, node, k);
				if (bestSwapIndex) {
					swapNodes(layerTracker[j], k, bestSwapIndex);
					nodeWasSwapped = true;
				}
			}
		}
		if (!nodeWasSwapped) break;
	}
	const nodesByDegree = sortNodesByDegree(layerTracker);
	for (let i = 0; i < 10; i++) {
		const nodeWasSwapped = siftNodes(layerTracker, nodesByDegree);
		if (!nodeWasSwapped) break;
	}

	for (let i = 0; i < 2; i++) {
		let nodeWasSwapped = false;
		for (let j = 0; j <= maxLayer; j++) {
			for (let k = 0; k < layerTracker[j].length; k++) {
				const node = layerTracker[j][k];
				const bestNullSwapIndex = findBestNullSwap(layerTracker, node, k);
				if (bestNullSwapIndex) {
					swapNodes(layerTracker[j], k, bestNullSwapIndex);
					nodeWasSwapped = true;
				}
			}
		}
		if (!nodeWasSwapped) break;
	}
	const grid: Array<Array<LayerNode>> = [];
	for (let i = 0; i <= maxLayer; i++) {
		grid.push(layerTracker[i]);
	}
	return grid;
}

function assignNodeDepthAndNesting(node: FlowChartNode, len = 0, nest = 0): void {
	const nodesToNest: Array<FlowChartNode> = [];
	const helper = (node: FlowChartNode, len = 0, nest = 0) => {
		node.depth = Math.max(node.depth, len);
		node.nesting = Math.max(node.nesting, nest);
		nodesToNest.push(node);
		for (const childConnection of node.children) {
			const { node, length } = childConnection;
			helper(node, length + len, nest + 1);
		}
	};
	helper(node, len, nest);
	for (const node of nodesToNest) {
		if (node.children.length) {
			node.nesting = node.children[0].node.nesting - 1;
			node.depth = node.children[0].node.depth - node.children[0].length;
			for (const child of node.children) {
				node.nesting = Math.min(node.nesting, child.node.nesting - 1);
				node.depth = Math.min(node.depth, child.node.depth - child.length);
			}
		}
	}
}

function layerAssignment(flowChart: FlowChart): [LayerTracker, number] {
	let maxLayer = 0;
	const layerTracker: LayerTracker = {};
	for (const nodeId in flowChart.nodeList) {
		const { depth, parents, children, type, data } = flowChart.nodeList[nodeId];
		maxLayer = Math.max(maxLayer, depth);
		if (!layerTracker[depth]) layerTracker[depth] = [];
		const newNode: LayerNode = {
			id: nodeId,
			children: [],
			parents: [],
			layer: depth,
			type: type.trim()
		};
		if (data.props) newNode.propsId = data.props.trim();
		for (const parent of parents) newNode.parents.push(parent.node.id);
		for (const child of children) newNode.children.push(child.node.id);
		layerTracker[depth].push(newNode);
	}
	return [layerTracker, maxLayer];
}

function populateGhostNodes(layerTracker: LayerTracker, flowChart: FlowChart) {
	for (const nodeId in flowChart.nodeList) {
		for (const child of flowChart.nodeList[nodeId].children) {
			if (child.node.depth - 1 > flowChart.nodeList[nodeId].depth) {
				const startLayer = flowChart.nodeList[nodeId].depth + 1;
				const endLayer = child.node.depth - 1;
				const ghostNodeCollection: Array<LayerNode> = [];
				let ghostNodeIncrement = 0;
				for (let i = startLayer; i <= endLayer; i++) {
					const ghostNode: LayerNode = {
						id: `GHOST_${child.node.id}_${ghostNodeIncrement}`,
						children: [],
						parents: [],
						layer: i,
						ignore: true
					};
					ghostNodeCollection.push(ghostNode);
					ghostNodeIncrement++;
				}
				for (const parent of child.node.parents)
					ghostNodeCollection[0].parents.push(parent.node.id);
				ghostNodeCollection[ghostNodeCollection.length - 1].children.push(child.node.id);
				for (let i = 0; i < ghostNodeCollection.length - 1; i++)
					ghostNodeCollection[i].children.push(`GHOST_${child.node.id}_${i + 1}`);
				for (let i = endLayer; i >= startLayer; i--)
					if (ghostNodeCollection.length > 0) {
						layerTracker[i].push(ghostNodeCollection[0]);
					}
				for (const node of layerTracker[flowChart.nodeList[nodeId].depth]) {
					if (node.id === nodeId) {
						node.children.push(ghostNodeCollection[0].id);
						node.children = node.children.filter((childId) => childId !== child.node.id);
					}
				}
			}
		}
	}
}

function balanceLayers(layerTracker: LayerTracker) {
	let longestLayer = 0;
	for (const layer in layerTracker)
		longestLayer = Math.max(layerTracker[layer].length, longestLayer);
	for (const layer in layerTracker) {
		if (layerTracker[layer].length < longestLayer) {
			const balanceArray: Array<LayerNode> = Array.from(
				{ length: longestLayer - layerTracker[layer].length },
				() => {
					return {
						id: 'NULL_NODE',
						children: [],
						parents: [],
						layer: parseInt(layer),
						ignore: true
					};
				}
			);
			layerTracker[layer] = layerTracker[layer].concat(balanceArray);
		}
	}
}

function getAdjacencyMatrix(layerTracker: LayerTracker, node: LayerNode, index: number): number {
	let adjacencySum = 0;
	let nodeCount = 0;
	for (const parentId of node.parents) {
		for (let i = 0; i < layerTracker[node.layer - 1].length; i++) {
			if (parentId === layerTracker[node.layer - 1][i].id) {
				adjacencySum += Math.abs(index - i);
				break;
			}
		}
		nodeCount++;
	}
	for (const childId of node.children) {
		for (let i = 0; i < layerTracker[node.layer + 1].length; i++) {
			if (childId === layerTracker[node.layer + 1][i].id) {
				adjacencySum += Math.abs(index - i);
				break;
			}
		}
		nodeCount++;
	}
	if (isNaN(adjacencySum / nodeCount)) return 0;
	return adjacencySum / nodeCount;
}

function getAdjacencyWithParents(
	layerTracker: LayerTracker,
	node: LayerNode,
	index: number
): number {
	let adjacencySum = 0;
	let nodeCount = 0;
	for (const parentId of node.parents) {
		for (let i = 0; i < layerTracker[node.layer - 1].length; i++) {
			if (parentId === layerTracker[node.layer - 1][i].id) {
				adjacencySum += Math.abs(index - i);
				break;
			}
		}
		nodeCount++;
	}
	if (isNaN(adjacencySum / nodeCount)) return 0;
	return adjacencySum / nodeCount;
}

function getAdjacencyWithChildren(
	layerTracker: LayerTracker,
	node: LayerNode,
	index: number
): number {
	let adjacencySum = 0;
	let nodeCount = 0;
	for (const childId of node.children) {
		for (let i = 0; i < layerTracker[node.layer + 1].length; i++) {
			if (childId === layerTracker[node.layer + 1][i].id) {
				adjacencySum += Math.abs(index - i);
				break;
			}
		}
		nodeCount++;
	}
	if (isNaN(adjacencySum / nodeCount)) return 0;
	return adjacencySum / nodeCount;
}

function findBestNullSwap(
	layerTracker: LayerTracker,
	node: LayerNode,
	initialIndex: number
): number | null {
	const initialCrossings = countCrossings(layerTracker, node.layer);
	let initialAdjacency = 0;
	if (node.layer === 0)
		initialAdjacency = getAdjacencyWithChildren(layerTracker, node, initialIndex);
	else initialAdjacency = getAdjacencyWithParents(layerTracker, node, initialIndex);
	let minimumAdjacency = initialAdjacency;
	let indexToSwap = initialIndex;
	for (let i = 0; i < layerTracker[node.layer].length; i++) {
		const currentNode = layerTracker[node.layer][i];
		if (currentNode.id === 'NULL_NODE') {
			swapNodes(layerTracker[node.layer], initialIndex, i);
			const crossings = countCrossings(layerTracker, node.layer);
			let adjacency = 0;
			if (node.layer === 0) adjacency = getAdjacencyWithChildren(layerTracker, node, i);
			else adjacency = getAdjacencyWithParents(layerTracker, node, i);
			if (crossings <= initialCrossings && adjacency < minimumAdjacency) {
				minimumAdjacency = adjacency;
				indexToSwap = i;
			}
			swapNodes(layerTracker[node.layer], i, initialIndex);
		}
	}
	if (indexToSwap === initialIndex) return null;
	return indexToSwap;
}

function findBestSwapIndex(
	layerTracker: LayerTracker,
	node: LayerNode,
	initialIndex: number
): number | null {
	const adjacencyMatrixTracker: { [key: number]: number } = {};
	let minMatrix = Infinity;
	let minMatrixIndex = 0;
	for (let i = 0; i < layerTracker[node.layer].length; i++) {
		const originalNodeMatrix = getAdjacencyMatrix(layerTracker, node, i);
		const swappableNodeMatrix = getAdjacencyMatrix(
			layerTracker,
			layerTracker[node.layer][i],
			initialIndex
		);
		adjacencyMatrixTracker[i] = originalNodeMatrix + swappableNodeMatrix;
	}
	for (const index in adjacencyMatrixTracker) {
		if (adjacencyMatrixTracker[index] < minMatrix) {
			minMatrix = adjacencyMatrixTracker[index];
			minMatrixIndex = parseInt(index);
		}
	}
	if (minMatrixIndex === initialIndex) return null;
	return minMatrixIndex;
}

function swapNodes(layer: Array<LayerNode>, nodeIndex: number, swapIndex: number): void {
	const tempNode = layer[nodeIndex];
	layer[nodeIndex] = layer[swapIndex];
	layer[swapIndex] = tempNode;
}

function sortNodesByDegree(layerTracker: LayerTracker) {
	const nodes: Array<LayerNode> = [];
	for (const layer in layerTracker) {
		for (const node of layerTracker[layer]) {
			nodes.push(node);
		}
	}
	return nodes.sort(
		(node1, node2) =>
			node2.parents.length + node2.children.length - (node1.parents.length + node1.children.length)
	);
}

function countCrossings(layerTracker: LayerTracker, layer: number) {
	let crossings = 0;
	for (let i = 0; i < layerTracker[layer].length; i++) {
		const currentNode = layerTracker[layer][i];
		const parentsAheadIndices: Array<number> = [];
		const childrenAheadIndices: Array<number> = [];
		if (layerTracker[layer - 1]) {
			for (let j = i + 1; j < layerTracker[layer - 1].length; j++) {
				if (currentNode.parents.includes(layerTracker[layer - 1][j].id))
					parentsAheadIndices.push(j);
			}
		}
		if (layerTracker[layer + 1]) {
			for (let j = i + 1; j < layerTracker[layer + 1].length; j++) {
				if (currentNode.children.includes(layerTracker[layer + 1][j].id))
					childrenAheadIndices.push(j);
			}
		}
		for (let j = i + 1; j < layerTracker[layer].length; j++) {
			const siblingNode = layerTracker[layer][j];
			if (parentsAheadIndices.length) {
				for (let k = 0; k < layerTracker[layer - 1].length; k++) {
					if (siblingNode.parents.includes(layerTracker[layer - 1][k].id)) {
						parentsAheadIndices.forEach((index) => {
							if (k < index) crossings++;
						});
					}
				}
			}
			if (childrenAheadIndices.length) {
				for (let k = 0; k < layerTracker[layer + 1].length; k++) {
					if (siblingNode.children.includes(layerTracker[layer + 1][k].id)) {
						childrenAheadIndices.forEach((index) => {
							if (k < index) crossings++;
						});
					}
				}
			}
		}
	}
	return crossings;
}

function siftNodes(layerTracker: LayerTracker, sortedNodes: Array<LayerNode>) {
	let nodeWasSwapped = false;
	for (const node of sortedNodes) {
		if (node.children.length + node.parents.length === 0) return nodeWasSwapped;
		let nodeIndex = 0;
		for (let i = 0; i < layerTracker[node.layer].length; i++) {
			if (layerTracker[node.layer][i].id === node.id) {
				nodeIndex = i;
				break;
			}
		}
		let minCrossings = Infinity;
		let minCrossingsIndex = nodeIndex;
		for (let i = 0; i < layerTracker[node.layer].length; i++) {
			swapNodes(layerTracker[node.layer], nodeIndex, i);
			const crossings = countCrossings(layerTracker, node.layer);
			if (crossings < minCrossings) {
				minCrossings = crossings;
				minCrossingsIndex = i;
			}
			swapNodes(layerTracker[node.layer], i, nodeIndex);
		}
		if (minCrossingsIndex !== nodeIndex) {
			swapNodes(layerTracker[node.layer], nodeIndex, minCrossingsIndex);
			nodeWasSwapped = true;
		}
	}
	return nodeWasSwapped;
}

function rotateGrid(grid: Array<Array<LayerNode>>, n: number) {
	if (n === 0) return;
	while (n > 0) {
		for (let i = 0; i < grid.length; i++) grid[i].reverse();
		for (let i = 0; i < grid.length; i++) {
			for (let j = i; j < grid.length; j++) {
				const temp = grid[i][j];
				grid[i][j] = grid[j][i];
				grid[j][i] = temp;
			}
		}
		n--;
	}
}

// function makeGridSquare(grid: Array<Array<LayerNode>>) {
// 	let largestSubArray = 0;
// 	for (const array of grid) {
// 		largestSubArray = Math.max(largestSubArray, array.length);
// 	}
// 	while (grid.length < largestSubArray)
// 		grid.push(
// 			Array.from({ length: largestSubArray }, () => {
// 				return { id: 'NULL_NODE', children: [], parents: [], layer: grid.length };
// 			})
// 		);
// 	for (const [i, array] of grid.entries()) {
// 		if (array.length < largestSubArray) {
// 			while (array.length < largestSubArray)
// 				array.push({ id: 'NULL_NODE', children: [], parents: [], layer: i });
// 		}
// 	}
// }
