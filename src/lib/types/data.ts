import type { Writable } from 'svelte/store';

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
