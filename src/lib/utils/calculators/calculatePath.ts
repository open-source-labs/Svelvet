export function calculatePath(path: SVGPathElement, position: number) {
	const pathLength = path.getTotalLength();
	const halfLength = pathLength * position;
	return path.getPointAtLength(halfLength);
}
