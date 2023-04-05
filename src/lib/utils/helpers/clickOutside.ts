export function clickOutside(node: HTMLElement) {
	const handleClick = (event: Event) => {
		if (!event.target || !node.contains(event.target as Node)) {
			node.dispatchEvent(new CustomEvent('outclick'));
		}
	};

	window.addEventListener('mousedown', handleClick, true);

	return {
		destroy() {
			window.removeEventListener('mousedown', handleClick, true);
		}
	};
}
