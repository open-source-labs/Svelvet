export function debounce<T extends unknown[], R>(
	func: (...args: T) => R,
	wait: number
): (...args: T) => void {
	let timeout: ReturnType<typeof setTimeout> | null;

	return (...args: T) => {
		if (timeout) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(() => {
			func(...args);
		}, wait);
	};
}
