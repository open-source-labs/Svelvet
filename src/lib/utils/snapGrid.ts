//SnapGrid file defines the grid cell size
//takes node position and rounds it to the nearest grid intersection
//returns new snapped position

export const cell = { width: 200, height: 100 };

/**
 * Snaps a given position to the nearest grid cell.
 * @param x - The x-coordinate of the node
 * @param y - The y-coordinate of the node
 * @returns The new snapped (x, y) position
 */

export function getSnappedPosition(x: number, y: number): { x: number; y: number } {

	// console.log('Snapping position:', { x, y }); // Debugging line

	return {
		x: Math.round(x / cell.width) * cell.width,
		y: Math.round(y / cell.height) * cell.height
	};
}
