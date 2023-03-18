import type { Writable } from 'svelte/store';

export function zoomGraph(writableScale: Writable<number>, newScale: number): void {
	writableScale.update(() => {
		return newScale;
	});
}
