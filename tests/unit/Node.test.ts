// import Nodes from '$lib/views/Nodes/index.svelte';
import TestNode from './TestNodeSlot.svelte';
// import { render, screen } from '@testing-library/svelte';
// import type { Node } from 'src/libOld/types/types';

// const mockNodes: Node[] = [
//   {
//     id: 1,
//     position: { x: 100, y: 50 },
//     data: { label: 'test-node-1' },
//     width: 175,
//     height: 40,
//     bgColor: 'white',
//   },
//   {
//     id: 2,
//     position: { x: 200, y: 250 },
//     data: { label: 'test-node-2' },
//     width: 175,
//     height: 40,
//     bgColor: 'white',
//   },
// ];

// test('should mount the node wrapper div', () => {
//   const { container } = render(Nodes, { node: mockNodes[0] });
//   expect(container.getElementsByClassName('Node')).toBeTruthy();
// });

// test('should display node labels in slot', () => {
//   render(TestNode, { props: { node: mockNodes[0] } });
//   render(TestNode, { props: { node: mockNodes[1] } });
//   expect(screen.getByText('test-node-1')).toBeInTheDocument();
//   expect(screen.getByText('test-node-2')).toBeInTheDocument();
// });
