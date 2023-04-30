import { get } from 'svelte/store';
import type { Graph } from '$lib/types';
import { calculateZoom, calculateTranslation } from '../calculators';

export function zoomAndTranslate(
	direction = 1,
	dimensions: Graph['dimensions'],
	transforms: Graph['transforms'],
	increment = 0.1
) {
	const graphDimensions = get(dimensions);

	const { width, height, top, left } = graphDimensions;

	const scaleStore = transforms.scale;
	const graphTranslation = get(transforms.translation);
	const scale = get(scaleStore);

	const newScale = calculateZoom(scale, direction, increment);
	const newTranslation = calculateTranslation(
		scale,
		newScale,
		graphTranslation,
		{ x: width / 2 + left, y: height / 2 + top },
		graphDimensions
	);
	scaleStore.set(newScale);
	transforms.translation.set(newTranslation);
}
