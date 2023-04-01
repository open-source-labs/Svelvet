import type { CSSColorString } from '$lib/types';

export function getRandomColor(): CSSColorString {
	const random255 = () => Math.floor(Math.random() * 256);
	const r = random255();
	const g = random255();
	const b = random255();
	return `rgb(${r},${g},${b})`;
}
