export function calculatePath(path: SVGPathElement) {
	const pathLength = path.getTotalLength();
	const halfLength = pathLength / 2;
	return path.getPointAtLength(halfLength);
}
