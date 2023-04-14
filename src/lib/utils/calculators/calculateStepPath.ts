import type { Direction, StepDirection } from '$lib/types';
export function calculateStepPath(
	sourceDirection: Direction,
	targetDirection: Direction,
	deltaX: number,
	deltaY: number,
	stepBuffer: number
): { steps: StepDirection[]; distance: number[] } {
	const steps: StepDirection[] = [];
	const distance = [];
	const directionMap: Record<Direction, StepDirection> = {
		north: 'up',
		south: 'down',
		east: 'right',
		west: 'left',
		self: 'right'
	};

	const sourceSide: StepDirection = directionMap[sourceDirection];
	const targetSide: StepDirection = directionMap[targetDirection];
	const axis = ['left', 'right'].includes(sourceSide) ? 'x' : 'y';
	const oppositeAxis = axis === 'x' ? 'y' : 'x';

	const oppositeSide = (side: StepDirection): StepDirection =>
		({ left: 'right', right: 'left', up: 'down', down: 'up' }[side] as StepDirection);
	const getSign = (side: StepDirection) => (['left', 'up'].includes(side) ? -1 : 1);

	const oppositeSourceSide = oppositeSide(sourceSide);
	const oppositeTargetSide = oppositeSide(targetSide);
	const targetAxis = ['left', 'right'].includes(targetSide) ? 'x' : 'y';
	const targetSign = getSign(targetSide);
	const sourceSign = getSign(sourceSide);
	const direction = { x: deltaX, y: deltaY };

	const parallel = axis === targetAxis;

	const oppositeSource = direction[axis] * sourceSign < 0;
	const oppositeTarget = direction[targetAxis] * targetSign > 0;

	const initialDirection =
		axis === 'x' ? (deltaY > 0 ? 'down' : 'up') : deltaX > 0 ? 'right' : 'left';

	steps.push(sourceSide);
	if (!oppositeTarget) {
		distance.push(oppositeSource ? stepBuffer : Math.abs(direction[axis]) / (parallel ? 2 : 1));
		steps.push(initialDirection);
		distance.push(
			Math.abs(direction[oppositeAxis]) / (parallel ? 1 : oppositeSource ? 2 : 1) +
				stepBuffer * (parallel ? 0 : 1)
		);

		if (parallel) {
			steps.push(sourceSide);
			distance.push(Math.abs(direction[axis]) / 2);
		} else if (oppositeSource) {
			steps.push(oppositeSourceSide);
			distance.push(Math.abs(direction[axis]) + stepBuffer);
			steps.push(oppositeTargetSide);
			distance.push(Math.abs(direction[oppositeAxis]) / 2);
		}
	} else {
		distance.push(
			parallel ? stepBuffer : oppositeSource ? stepBuffer : Math.abs(direction[axis]) / 2
		);
		steps.push(initialDirection);
		distance.push(
			Math.abs(direction[oppositeAxis]) / (parallel ? 2 : 1) + (parallel ? 0 : stepBuffer)
		);

		steps.push(oppositeSource ? oppositeSourceSide : sourceSide);
		distance.push(
			Math.abs(direction[axis]) / (oppositeSource ? 1 : 2) +
				stepBuffer * (oppositeSource && parallel ? 2 : oppositeSource ? 1 : 0)
		);

		if (parallel) {
			steps.push(initialDirection);
			distance.push(Math.abs(direction[oppositeAxis]) / 2);
			steps.push(sourceSide);
			distance.push(stepBuffer);
		} else {
			steps.push(oppositeTargetSide);
			distance.push(stepBuffer);
		}
	}

	return { steps, distance };
}
