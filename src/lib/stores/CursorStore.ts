import { writable, readable } from 'svelte/store';

// This gets updated on user click
// Value is relative to the scale/translation of the particular graph
// It's updated via the derived cursor store on every graph
export const initialClickPosition = writable({ x: 0, y: 0 });

// This is a global store/event listener for the raw cursor position
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
