export function calculateFitContentWidth(element: HTMLElement) {
	element.style.width = 'fit-content';
	element.style.height = 'fit-content';
	const width = element.offsetWidth;
	const height = element.offsetHeight;
	return [width, height];
}
