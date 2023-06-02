import { writable, readable } from 'svelte/store';
import { getTouchDistance } from '$lib/utils/helpers';

// This gets updated on user click
// Value is relative to the scale/translation of the particular graph
// It's updated via the derived cursor store on every graph
export const initialClickPosition = writable({ x: 0, y: 0 });
export const touchDistance = writable(0);
export const tracking = writable(false);
export const resizing = writable(false);

// This is a global store/event listener for the raw cursor position
// This can be refined
export const cursorPositionRaw = readable({ x: 0, y: 0 }, (set) => {
	const updateCursorPosition = (e: MouseEvent) => {
		set({ x: e.clientX, y: e.clientY });
	};

	const updateTouchPosition = (e: TouchEvent) => {
		if (e.touches.length === 2) {
			const distance = getTouchDistance(e.touches[0], e.touches[1]);
			touchDistance.set(distance);
			const touchPoint = { x: e.touches[0].clientX, y: e.touches[0].clientY };
			set(touchPoint);
		} else if (e.touches.length === 1) {
			const x = e.touches[0].clientX;
			const y = e.touches[0].clientY;
			const touchPoint = { x, y };
			set(touchPoint);
			tracking.set(true);
		}
	};

	const onTouchStart = (e: TouchEvent) => {
		updateTouchPosition(e);

		window.addEventListener('touchend', onTouchEnd);
		window.addEventListener('touchmove', updateTouchPosition);
	};

	const onTouchEnd = () => {
		tracking.set(false);
		touchDistance.set(0);
		window.removeEventListener('touchmove', updateTouchPosition);
	};

	document.addEventListener('mousemove', updateCursorPosition);
	window.addEventListener('touchstart', onTouchStart, true);

	return () => {
		window.removeEventListener('mousemove', updateCursorPosition);
		window.removeEventListener('touchstart', onTouchStart);
		window.removeEventListener('touchmove', updateTouchPosition);
		window.removeEventListener('touchend', onTouchEnd);
	};
});
