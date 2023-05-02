import { calculateViewportCenter } from '../calculators/calculateViewPortCenter';
import { graphStore } from '$lib/stores';
import { get } from 'svelte/store';

export function getViewportCenter(graphId: string) {
	const graph = graphStore.get(`G-${graphId}`);
	if (!graph) throw new Error(`Graph with id ${graphId} not found`);

	return calculateViewportCenter(
		get(graph.dimensions),
		get(graph.transforms.translation),
		get(graph.transforms.scale)
	);
}
