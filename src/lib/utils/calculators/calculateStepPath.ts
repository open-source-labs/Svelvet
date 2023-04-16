import type { XYPair } from '$lib/types';

function calculateDotProduct(vector1: XYPair, vector2: XYPair) {
	console.log(vector1, vector2);
	const product = vector1.x * vector2.x + vector1.y * vector2.y;
	console.log(product);
	return product;
}

export interface VectorPlusPosition extends XYPair {
	direction: XYPair;
}
export function calculateStepPath(
	source: VectorPlusPosition,
	target: VectorPlusPosition,
	buffer: number
) {
	const steps = [];

	const deltaX = target.x - source.x;
	const deltaY = target.y - source.y;

	const sameDirection = areVectorsEqual(source.direction, target.direction);
	const orthogonal = calculateDotProduct(source.direction, target.direction) === 0;
	const crossing = areCrossing(source, target);

	const oppositeSource = multiply(source.direction, -1, -1);
	const oppositeTarget = multiply(target.direction, -1, -1);
	const perpendicularSource = { x: source.direction.y, y: source.direction.x };

	const sourceDirectionDelta = multiply(
		source.direction,
		deltaX - buffer * source.direction.x * (orthogonal ? 1 : sameDirection ? 0 : 2),
		deltaY - buffer * source.direction.y * (orthogonal ? 1 : sameDirection ? 0 : 2)
	);
	const targetDirectionDelta = multiply(
		target.direction,
		deltaX + buffer * target.direction.x * (orthogonal ? 1 : sameDirection ? 0 : 2),
		deltaY + buffer * target.direction.y * (orthogonal ? 1 : sameDirection ? 0 : 2)
	);

	const sourceReaching =
		Math.sign(sourceDirectionDelta.x) === -1 || Math.sign(sourceDirectionDelta.y) === -1;
	const targetReaching =
		Math.sign(targetDirectionDelta.x) === 1 || Math.sign(targetDirectionDelta.y) === 1;

	const sourceBuffer = multiply(source.direction, buffer, buffer);
	const targetBuffer = multiply(oppositeTarget, buffer, buffer);

	const fullSource = multiply(source.direction, deltaX, deltaY);
	const fullTarget = multiply(oppositeTarget, Math.abs(deltaX), Math.abs(deltaY));

	const halfSource = multiply(source.direction, deltaX / 2, deltaY / 2);
	const halfTarget = multiply(oppositeTarget, Math.abs(deltaX) / 2, Math.abs(deltaY) / 2);

	const fullDelta = multiply(perpendicularSource, deltaX, deltaY);

	const sourceFacingTarget = !crossing && !targetReaching && !sourceReaching;

	if (sourceReaching) steps.push(sourceBuffer);

	if (crossing && !targetReaching && !sourceReaching) {
		steps.push(fullSource);
		steps.push(fullTarget);
	} else if (sameDirection) {
		if (!sourceReaching) {
			steps.push(
				multiply(
					source.direction,
					buffer + (deltaX > 0 ? deltaX : 0),
					buffer + (deltaY > 0 ? deltaY : 0)
				)
			);
		}
		steps.push(fullDelta);
		if (!targetReaching) {
			steps.push(
				multiply(
					oppositeTarget,
					buffer + (deltaX > 0 ? 0 : Math.abs(deltaX)),
					buffer + (deltaY > 0 ? 0 : Math.abs(deltaY))
				)
			);
		}
	} else if (sourceFacingTarget) {
		steps.push(halfSource);
		steps.push(fullDelta);
		steps.push(halfTarget);
	} else if (sourceReaching && targetReaching) {
		if (orthogonal) {
			steps.push(
				multiply(
					target.direction,
					Math.abs(deltaX) < buffer * 2
						? target.direction.x * (deltaX + target.direction.x * buffer)
						: Math.abs(deltaX) + buffer,
					Math.abs(deltaY) < buffer * 2
						? target.direction.y * (deltaY + target.direction.y * buffer)
						: Math.abs(deltaY) + buffer
				)
			);
			steps.push(
				multiply(
					oppositeSource,
					deltaX < 0 ? Math.abs(deltaX) + buffer : buffer - deltaX,
					deltaY < 0 ? Math.abs(deltaY) + buffer : buffer - deltaY
				)
			);
		} else {
			steps.push(multiply(perpendicularSource, deltaX / 2, deltaY / 2));
			steps.push(
				multiply(
					target.direction,
					deltaX > 0 ? -(deltaX - buffer * 2) : Math.abs(deltaX) + buffer * 2,
					deltaY > 0 ? -(deltaY - buffer * 2) : Math.abs(deltaY) + buffer * 2
				)
			);
			steps.push(multiply(perpendicularSource, deltaX / 2, deltaY / 2));
		}
	} else if (sourceReaching) {
		steps.push(
			multiply(
				oppositeTarget,
				Math.abs(deltaX) < buffer * 2 ? Math.abs(deltaX) - buffer : Math.abs(deltaX) / 2,
				Math.abs(deltaY) < buffer * 2 ? Math.abs(deltaY) - buffer : Math.abs(deltaY) / 2
			)
		);
		steps.push(
			multiply(
				source.direction,
				Math.abs(deltaX) < buffer * 2 ? deltaX - buffer : deltaX - buffer,
				Math.abs(deltaY) < buffer * 2 ? deltaY - buffer : deltaY - buffer
			)
		);
		steps.push(
			multiply(
				oppositeTarget,
				Math.max(buffer, Math.abs(deltaX) / 2),
				Math.max(buffer, Math.abs(deltaY) / 2)
			)
		);
	} else if (targetReaching) {
		steps.push(
			multiply(
				source.direction,
				Math.max(buffer, Math.abs(deltaX) / 2),
				Math.max(buffer, Math.abs(deltaY) / 2)
			)
		);
		steps.push(
			multiply(
				target.direction,
				Math.abs(deltaX) < buffer && Math.sign(deltaX) !== target.direction.x
					? buffer - Math.abs(deltaX)
					: Math.abs(deltaX) + buffer,
				Math.abs(deltaY) < buffer && Math.sign(deltaY) !== target.direction.y
					? buffer - Math.abs(deltaY)
					: Math.abs(deltaY) + buffer
			)
		);
		steps.push(
			multiply(
				source.direction,
				Math.abs(deltaX) < buffer * 2 ? deltaX - buffer : Math.abs(deltaX) / 2,
				Math.abs(deltaY) < buffer * 2 ? deltaY - buffer : Math.abs(deltaY) / 2
			)
		);
	}

	if (targetReaching) {
		steps.push(targetBuffer);
	}

	return steps;
}

export function areCrossing(vec1: VectorPlusPosition, vec2: VectorPlusPosition) {
	const { x: dx1, y: dy1 } = vec1.direction;
	const { x: dx2, y: dy2 } = vec2.direction;
	const deltaX = vec2.x - vec1.x;
	const deltaY = vec2.y - vec1.y;

	if (dx1 * dy2 === dx2 * dy1) return false;
	return (
		(Math.sign(deltaY) === Math.sign(dy1 + dy2)) !== (Math.sign(deltaX) === Math.sign(dx1 + dx2))
	);
}

function multiply(vector: XYPair, deltaX: number, deltaY: number) {
	return { x: vector.x * deltaX, y: vector.y * deltaY };
}
function areVectorsEqual(vector1: XYPair, vector2: XYPair): boolean {
	return vector1.x === vector2.x && vector1.y === vector2.y;
}
