import { createNode } from '$lib/utils/createNode';

import type { Node } from '$lib/types';

interface Nodes {
	[key: string]: Node;
}

export function populateNodes(string: string) {
	const nodes: Nodes = {};
	let edges = string.split('\n');

	edges = edges.map((edge) => edge.replace(/\s/g, ''));
	// Remove all whitespace except newlines

	console.log(edges);
	let currentParent = null;
	let childCount = 0;
	let parentCount = 0;

	// Parse each edge and create node objects
	for (const edge of edges) {
		const [parentNodeString, childNodeString] = edge.split('-->');
		const [parentTitle, parentComponent, parentConfig] = parentNodeString.split('|');
		const [childTitle, childComponent, childConfig] = childNodeString.split('|');
		//const [parentTitle, childTitle] = edge.split('~~>');
		console.log({ childComponent });
		if (parentTitle === currentParent) {
			childCount++;
		} else {
			childCount = 1;
		}
		currentParent = parentTitle;
		const width = 100;
		const height = 100;
		let x = 100;
		let y = 100;

		if (!nodes[parentTitle]) {
			parentCount++;
			x = 250 + Math.floor(parentCount / 2) * 200 * (parentCount % 2 === 0 ? -1 : 1);
			y = 0;
		} else {
			let xtra = 0;
			let yeah = 0;
			nodes[parentTitle].position.y.subscribe((y: number) => (yeah = y));
			nodes[parentTitle].position.x.subscribe((x: number) => (xtra = x));
			y = yeah;
			x = xtra;
			//x = nodes[parentTitle].position.x + 200;
		}

		let newX = x + Math.floor(childCount / 2) * 200 * (childCount % 2 === 0 ? -1 : 1);
		const newY = y + 200;

		// Check if there's a node at that position already
		for (const node of Object.values(nodes)) {
			let xtra = 0;
			let yeah = 0;
			node.position.y.subscribe((y: number) => (yeah = y));
			node.position.x.subscribe((x: number) => (xtra = x));

			if (xtra === newX && yeah === newY) {
				if (newX < 250) {
					newX -= 200;
				} else {
					newX += 200;
				}
			}
		}
		const childNode =
			nodes[childTitle] ||
			createNode(childTitle, width, height, newX, newY, [], childComponent, {
				data: childConfig
			});
		const parentNode =
			nodes[parentTitle] ||
			createNode(parentTitle, width, height, x, y, [], parentComponent, { data: parentConfig });

		if (childComponent && !childNode.componentRef) childNode.componentRef = childComponent;
		if (parentComponent && !parentNode.componentRef) parentNode.componentRef = parentComponent;

		childNode.inputNodes.update((inputNodes) => {
			inputNodes.add(parentNode);
			return inputNodes;
		});

		parentNode.outputNodes.update((outputNodes) => {
			outputNodes.add(childNode);
			return outputNodes;
		});

		nodes[parentTitle] = parentNode;
		nodes[childTitle] = childNode;
	}

	//const rootNodes = Object.values(nodes).filter((node) => node.parentNodes.length === 0);

	return nodes;
}
