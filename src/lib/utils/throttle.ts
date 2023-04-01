export function throttle<T extends unknown[], R>(
	func: (...args: T) => R,
	limit: number
): (...args: T) => void {
	let lastCall = 0;

	return (...args: T) => {
		const now = new Date().getTime();

		if (now - lastCall >= limit) {
			lastCall = now;
			func(...args);
		}
	};
}
