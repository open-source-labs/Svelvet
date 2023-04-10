import { writable, readable } from 'svelte/store';
import { getTouchDistance, getTouchMidpoint } from '$lib/utils/helpers';

// This gets updated on user click
// Value is relative to the scale/translation of the particular graph
// It's updated via the derived cursor store on every graph
export const initialClickPosition = writable({ x: 0, y: 0 });
export const touchDistance = writable(0);

// This is a global store/event listener for the raw cursor position
export const cursorPositionRaw = readable({ x: 0, y: 0 }, (set) => {
	const updateCursorPosition = (e: MouseEvent) => {
		const x = e.clientX;
		const y = e.clientY;
		set({ x, y });
	};

	const updateTouchPosition = (e: TouchEvent) => {
		if (e.touches.length === 2) {
			const midpoint = getTouchMidpoint(e.touches[0], e.touches[1]);
			const distance = getTouchDistance(e.touches[0], e.touches[1]);
			touchDistance.set(distance);
			set({ x: midpoint.clientX, y: midpoint.clientY });
		} else if (e.touches.length === 1) {
			const x = e.touches[0].clientX;
			const y = e.touches[0].clientY;
			set({ x, y });
		}
	};

	const onTouchStart = (e: TouchEvent) => {
		updateTouchPosition(e);
		window.addEventListener('touchmove', updateTouchPosition);
	};

	const onTouchEnd = () => {
		touchDistance.set(0);
		window.removeEventListener('touchmove', updateTouchPosition);
	};

	window.addEventListener('mousemove', updateCursorPosition);
	window.addEventListener('touchstart', onTouchStart);
	window.addEventListener('touchend', onTouchEnd);

	return () => {
		window.removeEventListener('mousemove', updateCursorPosition);
		window.removeEventListener('touchstart', onTouchStart);
		window.removeEventListener('touchmove', updateTouchPosition);
		window.removeEventListener('touchend', onTouchEnd);
	};
});
