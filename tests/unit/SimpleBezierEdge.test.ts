import SimpleBezierEdge from '$lib/Edges/SimpleBezierEdge.svelte';
import { render, screen, cleanup } from '@testing-library/svelte';

const mockEdge = {
	id: 'e1-2',
	sourceX: 100,
	sourceY: 100,
	targetX: 200,
	targetY: 200,
	source: 1,
	target: 2,
	data: {
		label: 'this is the test edge'
	}
};

test('should calculate the correct bezier path string', () => {
	render(SimpleBezierEdge, { props: { edge: mockEdge } });
	const pathElement = screen.getByLabelText('svg-path');

	expect(pathElement).toHaveAttribute('d', 'M100,100 C100,150 200,150 200,200');
});
