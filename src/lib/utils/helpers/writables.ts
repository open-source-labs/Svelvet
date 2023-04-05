import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export function makeObjectValuesWritable<T extends Record<string, unknown>>(
	object: T
): { [K in keyof T]: Writable<T[K]> } {
	const writableObject = {} as { [K in keyof T]: Writable<T[K]> };

	for (const key in object) {
		writableObject[key] = writable(object[key]);
	}
	return writableObject;
}
