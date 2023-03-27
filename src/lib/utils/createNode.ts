import { writable, derived, readable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';
import type { Node, ConfigObject, Inputs, Outputs, Properties } from '$lib/types';

export interface UserNode {
	id: string;
	dimensions?: {
		width: number;
		height: number;
	};
	position?: {
		x: number;
		y: number;
	};
	data?: object;
	group?: string;
	inputs?: Inputs;
	outputs?: Outputs;
	componentRef?: string;
	config?: ConfigObject;
}

export function createNode(userNode: UserNode): Node {
	const { id, config } = userNode;

	const newNode: Node = {
		id,
		position: {
			x: writable(userNode?.position?.x || 0),
			y: writable(userNode?.position?.y || 0)
		},
		dimensions: {
			width: writable(userNode?.dimensions?.width || 100),
			height: writable(userNode?.dimensions?.height || 100)
		},
		group: writable(null),
		draggable: writable(true),
		selectable: writable(true),
		connectable: writable(true),
		deletable: writable(true),
		zIndex: writable(0),
		ariaLabel: `Node ${id}`,
		focusable: writable(true),
		resizing: writable(false),
		collapsed: writable(false),
		hidden: writable(false),
		inputs: writable({}),
		outputs: derived([], () => ({})),
		properties: writable({}),
		processor: (inputs: any, properties: any) => ({ ...inputs, ...properties }),
		componentRef: userNode.componentRef || 'default'
	};

	if (config) {
		const { properties, processor, inputs, outputs } = config;
		const inputsStore: Inputs = {};
		const propertiesStore: Properties = {};

		if (inputs) {
			for (const key in inputs) {
				const input = inputs[key];
				const inputStore = writable(input.initial);
				inputsStore[key] = inputStore;
			}
		}

		if (properties) {
			for (const key in properties) {
				const property = properties[key];
				const propertyStore = writable(property.initial);
				propertiesStore[key] = propertyStore;
			}
		}

		newNode.properties = writable(propertiesStore);
		newNode.processor = processor;
		newNode.inputs = writable(inputsStore);
		newNode.outputs = createCustomDerivedStore(inputsStore, propertiesStore, processor);
	}

	return newNode;
}

function createCustomDerivedStore(
	inputs: Inputs,
	properties: Properties,
	processor: (inputs: any, properties: any) => any
) {
	const outputStore = writable({});

	const updateOutputStore = () => {
		const currentInputs: { [key: string]: any } = {};
		const currentProperties: { [key: string]: any } = {};

		for (const key in inputs) {
			inputs[key].subscribe((value: any) => {
				currentInputs[key] = value;
			})();
		}

		for (const key in properties) {
			properties[key].subscribe((value: any) => {
				currentProperties[key] = value;
			})();
		}

		outputStore.set(processor(currentInputs, currentProperties));
	};

	const unsubscribeFns: (() => void)[] = [];

	for (const key in inputs) {
		const unsubscribe = inputs[key].subscribe(() => {
			updateOutputStore();
		});
		unsubscribeFns.push(unsubscribe);
	}

	for (const key in properties) {
		const unsubscribe = properties[key].subscribe(() => {
			updateOutputStore();
		});
		unsubscribeFns.push(unsubscribe);
	}

	return {
		subscribe: outputStore.subscribe,
		unsubscribe: () => {
			unsubscribeFns.forEach((fn) => fn());
		}
	};
}
