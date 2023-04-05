import type { Parameter, Properties } from './node';
import type { ParameterConfig } from './config';

export interface ConfigObject {
	[key: string]: unknown;
	properties?: Record<string, ParameterConfig>;
	processor: (inputs: Record<string, Parameter>, properties: Record<string, Parameter>) => object;
	inputs?: Record<string, ParameterConfig>;
	outputs?: {
		[key: string]: {
			id: string;
			label: string;
			value: unknown | null;
		};
	};
}
