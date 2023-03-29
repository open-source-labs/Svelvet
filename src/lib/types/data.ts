import type { Inputs, Properties } from './node';
import type { ParameterConfig } from './config';

export interface ConfigObject {
	[key: string]: unknown;
	properties?: Record<string, ParameterConfig>;
	processor: (inputs: Inputs, properties: Properties) => unknown;
	inputs?: Record<string, ParameterConfig>;
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
