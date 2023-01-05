import SimpleBezierEdge from '$lib/Edges/SimpleBezierEdge.svelte';
import { render, screen, cleanup } from '@testing-library/svelte';

const bottom_top = {
  id: 'e1-2',
  sourceX: 100,
  sourceY: 100,
  targetX: 200,
  targetY: 200,
  sourcePosition: 'bottom',
  targetPosition: 'top',
  data: {
    label: 'this is the test edge'
  }
};
const right_left = {
  id: 'e1-2',
  sourceX: 100,
  sourceY: 100,
  targetX: 200,
  targetY: 200,
  sourcePosition: 'right',
  targetPosition: 'left',
  data: {
    label: 'this is the test edge'
  }
};

const left_right = {
  id: 'e1-2',
  sourceX: 300,
  sourceY: 100,
  targetX: 200,
  targetY: 200,
  sourcePosition: 'left',
  targetPosition: 'right',
  data: {
    label: 'this is the test edge'
  }
};

const top_left = {
  id: 'e1-2',
  sourceX: 100,
  sourceY: 300,
  targetX: 200,
  targetY: 200,
  sourcePosition: 'top',
  targetPosition: 'left',
  data: {
    label: 'this is the test edge'
  }
};

const top_right = {
  id: 'e1-2',
  sourceX: 100,
  sourceY: 400,
  targetX: 200,
  targetY: 200,
  sourcePosition: 'top',
  targetPosition: 'right',
  data: {
    label: 'this is the test edge'
  }
};

const bottom_left = {
  id: 'e1-2',
  sourceX: 100,
  sourceY: 100,
  targetX: 200,
  targetY: 200,
  sourcePosition: 'bottom',
  targetPosition: 'left',
  data: {
    label: 'this is the test edge'
  }
};

test('should calculate the correct bezier path string from bottom to top', () => {
  render(SimpleBezierEdge, { props: { edge: bottom_top } });
  const pathElement = screen.getByLabelText('svg-path');

  expect(pathElement).toHaveAttribute('d', 'M100,100 C100,150 200,150 200,200');
});

test('should calculate the correct bezier path string from right to left', () => {
  render(SimpleBezierEdge, { props: { edge: right_left } });
  const pathElement = screen.getByLabelText('svg-path');

  expect(pathElement).toHaveAttribute('d', 'M100,100 C150,100 150,200 200,200');
});

test('should calculate the correct bezier path string from left to right', () => {
  render(SimpleBezierEdge, { props: { edge: left_right } });
  const pathElement = screen.getByLabelText('svg-path');

  expect(pathElement).toHaveAttribute('d', 'M300,100 C250,100 250,200 200,200');
});

test('should calculate the correct bezier path string from top to left', () => {
  render(SimpleBezierEdge, { props: { edge: top_left } });
  const pathElement = screen.getByLabelText('svg-path');

  expect(pathElement).toHaveAttribute('d', 'M100,300 C100,250 150,200 200,200');
});

test('should calculate the correct bezier path string from top to right', () => {
  render(SimpleBezierEdge, { props: { edge: top_right } });
  const pathElement = screen.getByLabelText('svg-path');

  expect(pathElement).toHaveAttribute('d', 'M100,400 C100,300 262.5,200 200,200');
});

test('should calculate the correct bezier path string from bottom to left', () => {
  render(SimpleBezierEdge, { props: { edge: bottom_left } });
  const pathElement = screen.getByLabelText('svg-path');

  expect(pathElement).toHaveAttribute('d', 'M100,100 C100,150 150,200 200,200');
});
