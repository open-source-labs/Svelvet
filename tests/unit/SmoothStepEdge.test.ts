import SmoothStepEdge from '$lib/views/Edges/SmoothStepEdge.svelte';
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
    label: 'this is the test edge',
  },
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
    label: 'this is the test edge',
  },
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
    label: 'this is the test edge',
  },
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
    label: 'this is the test edge',
  },
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
    label: 'this is the test edge',
  },
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
    label: 'this is the test edge',
  },
};

test('should calculate the correct smooth step path string from bottom to top', () => {
  render(SmoothStepEdge, { props: { edge: bottom_top } });
  const pathElement = screen.getByLabelText('svg-path');

  expect(pathElement).toHaveAttribute(
    'd',
    'M 100,100L 100,145Q 100,150 105,150L 195,150Q 200,150 200,155L 200,200'
  );
});

test('should calculate the correct smooth step path string from right to left', () => {
  render(SmoothStepEdge, { props: { edge: right_left } });
  const pathElement = screen.getByLabelText('svg-path');

  expect(pathElement).toHaveAttribute(
    'd',
    'M 100,100L 145,100Q 150,100 150,105L 150,195Q 150,200 155,200L 200,200'
  );
});

test('should calculate the correct smooth step path string from left to right', () => {
  render(SmoothStepEdge, { props: { edge: left_right } });
  const pathElement = screen.getByLabelText('svg-path');

  expect(pathElement).toHaveAttribute(
    'd',
    'M 300,100L 255,100Q 250,100 250,105L 250,195Q 250,200 245,200L 200,200'
  );
});

test('should calculate the correct mixed smooth step path string from top to left', () => {
  render(SmoothStepEdge, { props: { edge: top_left } });
  const pathElement = screen.getByLabelText('svg-path');

  expect(pathElement).toHaveAttribute(
    'd',
    'M 100,300L 100,205Q 100,200 105,200L 200,200'
  );
});

test('should calculate the correct mixed smooth step path string from top to right', () => {
  render(SmoothStepEdge, { props: { edge: top_right } });
  const pathElement = screen.getByLabelText('svg-path');

  expect(pathElement).toHaveAttribute(
    'd',
    'M 100,400L 100,205Q 100,200 105,200L 200,200'
  );
});

test('should calculate the correct mixed smooth step path string from bottom to left', () => {
  render(SmoothStepEdge, { props: { edge: bottom_left } });
  const pathElement = screen.getByLabelText('svg-path');

  expect(pathElement).toHaveAttribute(
    'd',
    'M 100,100L 100,195Q 100,200 105,200L 200,200'
  );
});
