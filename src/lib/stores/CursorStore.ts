import { writable } from 'svelte/store';

export const cursorPosition = {
	x: writable(0),
	y: writable(0)
};

export const initialClickPosition = writable({ x: 0, y: 0 });
