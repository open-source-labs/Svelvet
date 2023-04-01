export const calculateRelativeCursor = (
	e: { clientX: number; clientY: number },
	top: number,
	left: number,
	width: number,
	height: number,
	scale: number,
	translationX: number,
	translationY: number
) => {
	console.log('Cursoring');
	const { clientX, clientY } = e;
	const scaleCapture = scale;

	const xRelativeToWrapper = clientX - left;
	const yRelativeToWrapper = clientY - top;

	const xOffsetDueToTranslation = translationX;
	const yOffsetDueToTranslation = translationY;

	const xOffsetDuetToScale = (width * (1 - scale)) / 2;
	const yOffsetDuetToScale = (height * (1 - scale)) / 2;

	const newX = xRelativeToWrapper - xOffsetDueToTranslation - xOffsetDuetToScale;
	const newY = yRelativeToWrapper - yOffsetDueToTranslation - yOffsetDuetToScale;

	const newCursorX = newX / scaleCapture;
	const newCursorY = newY / scaleCapture;
	return { x: newCursorX, y: newCursorY };
};
