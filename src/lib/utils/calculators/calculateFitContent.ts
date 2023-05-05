export function calculateFitContentWidth(element: HTMLElement) {
	const previousWidth = element.style.width;
	const previousHeight = element.style.height;
	element.style.width = 'fit-content';
	element.style.height = 'fit-content';
	const width = element.offsetWidth;
	const height = element.offsetHeight;
	element.style.width = previousWidth;
	element.style.height = previousHeight;
	return [width, height];
}
