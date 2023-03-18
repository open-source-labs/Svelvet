import { writable } from 'svelte/store';

export const cursorPosition = {
	x: writable(0),
	y: writable(0)
};
