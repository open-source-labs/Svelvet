const MIN_SCALE = 0.4;
const MAX_SCALE = 4;

export function calculateZoom(scale: number, delta: number, zoomIncrement: number) {
	const scaleAdjustment = delta * zoomIncrement;
	const newScale = scale - scaleAdjustment;

	return Number(Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale)).toFixed(9));
}
