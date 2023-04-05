import { writable, derived } from 'svelte/store';
import type {
	Node,
	NodeConfig,
	Inputs,
	Properties,
	InputKey,
	NodeKey,
	XYPair,
	OutputKey,
	Anchor
} from '$lib/types';
import { generateOutput } from './generateOutput';
import {
	NODE_BORDER_COLOR_LIGHT,
	NODE_BORDER_RADIUS,
	NODE_FONT_COLOR_LIGHT,
	NODE_HEIGHT,
	NODE_WIDTH,
	NODE_HEADER_COLOR_LIGHT
} from '$lib/constants';
import { createStore } from './createStore';
import { createAnchor } from './createAnchor';

export function createNode(userNode: NodeConfig): Node {
	const { id, config, width, height, dimensions, header, position, headerColor, inputs, outputs } =
		userNode;
	const { bgColor, borderColor, borderRadius, textColor } = userNode;
	const idString = id ? id.toString() : Math.random().toString(24).substring(7);
	const nodeId: NodeKey = `N-${idString}`;

	const anchorStore = createStore<Anchor, OutputKey | InputKey>();

	inputs?.forEach((input) => {
		const positions = calculateInitialXYPercentage(input);
		positions.forEach((position, index) => {
			const inputId: InputKey = `I-${index}/${nodeId}`;
			anchorStore.add(createAnchor(position, input, 'input'), inputId);
		});
	});
	outputs?.forEach((output) => {
		const positions = calculateInitialXYPercentage(output);
		positions.forEach((position, index) => {
			const outputId: OutputKey = `O-${index}/${nodeId}`;
			anchorStore.add(createAnchor(position, output, 'output'), outputId);
		});
	});

	const newNode: Node = {
		id: `N-${idString}`,
		position: {
			x: writable(position?.x || 0),
			y: writable(position?.y || 0)
		},
		dimensions: {
			width: writable(width || dimensions?.width || NODE_WIDTH),
			height: writable(height || dimensions?.height || NODE_HEIGHT)
		},
		group: writable(null),
		draggable: writable(true),
		selectable: writable(true),
		connectable: writable(true),
		deletable: writable(true),
		hideable: writable(true),
		moving: writable(false),
		resizingWidth: writable(false),
		resizingHeight: writable(false),
		focusable: writable(true),
		resizable: writable(true),
		anchors: anchorStore,
		zIndex: writable(0),
		ariaLabel: `Node ${id}`,
		header: writable(header ? true : false),
		collapsed: writable(false),
		visible: writable(true),
		collapsible: writable(true),
		inputs: writable({}),
		props: userNode.props || null,
		borderRadius: writable(borderRadius || NODE_BORDER_RADIUS),
		properties: writable({}),
		headerHeight: writable(40),
		bgColor: writable(bgColor || null),
		component: userNode.component || null,
		processor: (inputs, properties) => ({ ...inputs, ...properties }),
		label: writable(userNode.label || ''),
		borderColor: writable(borderColor || NODE_BORDER_COLOR_LIGHT),
		textColor: writable(textColor || NODE_FONT_COLOR_LIGHT),
		headerColor: writable(headerColor || NODE_HEADER_COLOR_LIGHT)
	};

	if (config) {
		const { properties, processor, inputs } = config;
		const inputsStore: Inputs = {};
		const propertiesStore: Properties = {};

		if (inputs) {
			for (const key in inputs) {
				//const inputKey: InputKey = `I-${key}/N-${id}`
				const input = inputs[key];
				inputsStore[key] = writable(input.initial);
			}
		}

		if (properties) {
			for (const key in properties) {
				//const propertyKey: ParameterKey = `P-${key}/N-${id}`
				const property = properties[key];
				propertiesStore[key] = writable(property.initial);
			}
		}

		newNode.config = config;
		newNode.properties = writable(propertiesStore);
		newNode.processor = processor;
		newNode.inputs = writable(inputsStore);
		newNode.outputs = generateOutput(newNode.inputs, newNode.properties, processor);
	}

	return newNode;
}

const calculateInitialXYPercentage = (input) => {
	const { side, align, gap, offset, count } = input;
	let xPercentage = 0;
	let yPercentage = 0;

	const anchors = [];

	if (side !== 'left' && side !== 'top') {
		if (side === 'right') {
			xPercentage = 1;
		} else {
			yPercentage = 1;
		}
	}
	console.log(count);
	const halfCount = ((count || 0) - 1) / 2;

	for (let i = 0; i < (count || 1); i++) {
		let initialY = yPercentage;
		let initialX = xPercentage;
		const gapSize = gap || 0;
		if (align !== 'center') {
			if (align === 'end') {
				if (side === 'left' || side === 'right') {
					console.log('here');
					initialY = 1 - i * gapSize;
				} else {
					initialX = 1 - i * gapSize;
				}
			} else {
				if (side === 'left' || side === 'right') {
					initialY = i * gapSize;
				} else {
					initialX = i * gapSize;
				}
			}
		} else {
			if (side === 'left' || side === 'right') {
				initialY = 0.5 - (i - halfCount) * gapSize;
			} else {
				initialX = 0.5 - (i - halfCount) * gapSize;
			}
		}
		anchors.push({
			x: initialX + (offset?.x || 0),
			y: initialY + (offset?.y || 0)
		});
	}
	return anchors;
};
