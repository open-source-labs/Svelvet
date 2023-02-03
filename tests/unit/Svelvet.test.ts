// import Svelvet from '../../src/lib/Containers/Svelvet/index.svelte';
import Svelvet from '$lib/container/views/Svelvet.svelte';
import { render, prettyDOM } from '@testing-library/svelte';

const handleClick = (e: object) => {
  console.log(e);
};

const initialNodes = [
  {
    id: 1,
    position: { x: 0, y: 80 },
    data: { label: 'Input Node' },
    width: 100,
    height: 200,
    bgColor: 'white',
    clickCallback: handleClick,
    borderColor: 'transparent',
    image: true,
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg',
    sourcePosition: 'right',
  },
  {
    id: 2,
    data: { label: 'Option #1' },
    position: { x: 250, y: 0 },
    width: 175,
    height: 40,
    bgColor: '#B8FFC6',
    borderColor: 'transparent',
    clickCallback: handleClick,
    sourcePosition: 'right',
    targetPosition: 'left',
  },
  {
    id: 3,
    position: { x: 250, y: 260 },
    data: { label: 'Option #2' },
    width: 175,
    height: 40,
    bgColor: '#FFB8B8',
    borderColor: 'transparent',
    clickCallback: handleClick,
    sourcePosition: 'right',
    targetPosition: 'top',
  },
  {
    id: 4,
    position: { x: 500, y: 0 },
    data: { label: 'Output Node' },
    width: 175,
    height: 40,
    bgColor: 'white',
    clickCallback: handleClick,
    sourcePosition: 'right',
    targetPosition: 'left',
  },
  {
    id: 5,
    position: { x: 300, y: 200 },
    data: { label: 'top' },
    width: 175,
    height: 40,
    bgColor: 'white',
    clickCallback: handleClick,
    sourcePosition: 'top',
  },
];
const initialEdges = [
  {
    id: 'e1-2',
    source: 1,
    target: 2,
    type: 'step',
    label: '  YES  ',
    animate: true,
  },
  { id: 'e2-3', source: 1, target: 3, type: 'step', label: '  NO  ' },
  { id: 'e2-4', source: 2, target: 4, label: 'test', animate: true },
  { id: 'e2-5', source: 3, target: 4, animate: true },
];

test('Svelvet componet should render', () => {
  const { container } = render(Svelvet, {
    props: {
      nodes: initialNodes,
      edges: initialEdges,
      width: 600,
      background: false,
    },
  });
  expect(container.getElementsByClassName('Svelvet')).toBeTruthy();

  //const length = container.querySelectorAll('[class^=Node]');
  //const length = document.getElementsByClassName('Node');
  //console.log(prettyDOM(container))
  //expect(length.length).toBe(6)
});
