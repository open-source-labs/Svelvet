import { get } from 'svelte/store';
import type { Graph } from '$lib/types';
import { calculateZoom, calculateTranslation } from '../calculators';
import { zoomGraph, translateGraph } from '.';

export function zoomAndTranslate(direction = 1, graphStore: Graph, increment = 0.1) {
	const dimensions = get(graphStore.dimensions);

	const { width, height, top, left } = dimensions;

	const scaleStore = graphStore.transforms.scale;
	const translationXStore = graphStore.transforms.translation.x;
	const translationYStore = graphStore.transforms.translation.y;
	const scale = get(scaleStore);

	const newScale = calculateZoom(scale, direction, increment);
	const newTranslation = calculateTranslation(
		scale,
		newScale,
		{ x: get(translationXStore), y: get(translationYStore) },
		{ x: width / 2 + left, y: height / 2 + top },
		dimensions
	);
	zoomGraph(scaleStore, newScale);
	translateGraph(graphStore.transforms.translation, newTranslation);
}
