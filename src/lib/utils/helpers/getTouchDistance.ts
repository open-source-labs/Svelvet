// Calculate the distance between two touches (used for pinch-zoom)
export function getTouchDistance(touch1: Touch, touch2: Touch) {
	const dx = touch1.clientX - touch2.clientX;
	const dy = touch1.clientY - touch2.clientY;
	return Math.sqrt(dx * dx + dy * dy);
}
