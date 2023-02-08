import BaseEdge from '$lib/edges/views/Edges/BaseEdge.svelte';
import { render, screen, cleanup } from '@testing-library/svelte';

// afterEach(() => cleanup());
// beforeEach(() => {
//   render(BaseEdge, {
//     baseEdgeProps: { path: 'M 10 10 C 20 20, 40 20, 50 10' },
//   });
// });

test('should mount the path element', async () => {
  // const pathElement = screen.getByLabelText('svg-path');
  // expect(pathElement).toBeInTheDocument();
});

test('should have the correct d attribute passed in from baseEdgeProps', async () => {
  // const pathElement = screen.getByLabelText('svg-path');
  // expect(pathElement).toHaveAttribute('d', 'M 10 10 C 20 20, 40 20, 50 10');
});
