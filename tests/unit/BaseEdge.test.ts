import BaseEdge from '../../src/lib/Edges/BaseEdge.svelte';
import { render } from '@testing-library/svelte';

it('should have title text', () => {
	render(BaseEdge, { baseEdgeProps: { path: 'path string' } });
});
