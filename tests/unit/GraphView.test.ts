import GraphView from '../../src/lib/Containers/GraphView/index.svelte';
import { render } from '@testing-library/svelte';

it('should mount the svg element', () => {
	const nodesStore = [];
	const derivedEdges = [];
	render(GraphView, { baseEdgeProps: { path: 'path string' } });
});
