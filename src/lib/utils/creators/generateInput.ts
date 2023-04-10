import type { Writable } from 'svelte/store';
import type { WrappedWritable } from '$lib/types';
import { writable } from 'svelte/store';

export function generateInput<T extends Record<string, number | string | boolean | object>>(
	initialData: T
): Writable<WrappedWritable<T>> {
	const newStore: Partial<WrappedWritable<T>> = {};
	for (const key in initialData) {
		newStore[key as keyof T] = writable(initialData[key as keyof T]);
	}
	return writable(newStore as WrappedWritable<T>);
}
