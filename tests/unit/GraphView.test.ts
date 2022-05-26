import GraphView from '../../src/lib/Containers/GraphView/index.svelte';
import { render, screen } from '@testing-library/svelte';

test('should mount the svg element', () => {
	// const nodesStore = [
	// 	// {
	// 	// 	id: 1,
	// 	// 	type: 'input',
	// 	// 	position: { x: 100, y: 50 },
	// 	// 	data: { label: 'Input' },
	// 	// 	width: 175,
	// 	// 	height: 40,
	// 	// 	bgColor: 'white'
	// 	// },
	// 	// {
	// 	// 	id: 2,
	// 	// 	type: 'default',
	// 	// 	position: { x: 200, y: 250 },
	// 	// 	data: { label: 'Default' },
	// 	// 	width: 175,
	// 	// 	height: 40,
	// 	// 	bgColor: 'white'
	// 	// }
	// ];
	// const derivedEdges = [];
	// render(GraphView, { nodesStore: nodesStore, derivedEdges: derivedEdges });
	// expect(screen.getByRole('graphics-document')).toBeInTheDocument();
});
