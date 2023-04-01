import { writable, readable } from 'svelte/store';

export const cursorPosition = {
	x: writable(0),
	y: writable(0)
};

export const initialClickPosition = writable({ x: 0, y: 0 });

export const cursorPositionRaw = readable({ x: 0, y: 0 }, (set) => {
	const updateCursorPosition = (e: MouseEvent) => {
		const x = e.clientX;
		const y = e.clientY;
		set({ x, y });
	};

	window.addEventListener('mousemove', updateCursorPosition);

	return () => {
		window.removeEventListener('mousemove', updateCursorPosition);
	};
});
