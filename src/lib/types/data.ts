import type { Parameter } from './node';
import type { ParameterConfig } from './config';
import type { Writable } from 'svelte/store';
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

export type UnwrapWritable<T> = {
	[K in keyof T]: T[K] extends Writable<infer U> ? U : never;
};

export interface CustomWritable<T> extends Omit<Writable<T>, 'set' | 'update'> {
	set: ((value: T) => void) | null;
	update: ((fn: (value: T) => T) => void) | null;
}
export type WrappedWritable<T> = {
	[K in keyof T]: CustomWritable<T[K]>;
};
