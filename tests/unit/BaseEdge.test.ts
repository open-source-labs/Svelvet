import BaseEdge from '../../src/lib/Edges/BaseEdge.svelte';
import { render, screen, cleanup } from '@testing-library/svelte';

// afterEach(() => cleanup());

test('should mount the path element with the correct path string', async () => {
	render(BaseEdge, { baseEdgeProps: { path: 'M 10 10 C 20 20, 40 20, 50 10' } });
	const pathElement = screen.getByLabelText('svg-path');

	expect(pathElement).toBeInTheDocument();
	expect(pathElement).toHaveAttribute('d', 'M 10 10 C 20 20, 40 20, 50 10');
});
