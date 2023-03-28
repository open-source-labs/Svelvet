import type { UserProperties } from './node';
import type { Inputs, Properties } from './node';

export interface ConfigObject {
	[key: string]: unknown;
	properties?: UserProperties;
	processor: (inputs: Inputs, properties: Properties) => unknown;
	inputs?: {
		[key: string]: {
			id: string;
			label: string;
			type: string;
			initial: unknown;
			min?: number;
			max?: number;
			step?: number;
			rounding?: number;
			connection: null | string;
		};
	};
	outputs?: {
		[key: string]: {
			id: string;
			label: string;
			value: unknown | null;
		};
	};
}

export interface DataObject {
	id: string;
	[key: string]: unknown;
}
