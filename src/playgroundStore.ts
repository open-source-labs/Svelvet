/* EVERYTHING YOU NEED TO ACCESS DYNAMIC NODE AND EDGE ADDITIONS ON THE REPL PLAYGROUND ON WEBSITE */
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export interface NodeProps {
  idNumber: Writable<number>;
  positionX: Writable<number>;
  positionY: Writable<number>;
  data: Writable<string>;
  width: Writable<number>;
  height: Writable<number>;
  borderColor: Writable<string>;
  borderRadius: Writable<number>;
  bgColor: Writable<string>;
  textColor: Writable<string>;
  sourcePosition: Writable<string>;
  targetPosition: Writable<string>;
  image: Writable<boolean>;
  src: Writable<string>;
  clickCallback: Writable<string>;
}
export interface EdgeProps {
  id: Writable<string>;
  source: Writable<number>;
  target: Writable<number>;
  edgeLabel: Writable<string>;
  animate: Writable<boolean>;
  arrow: Writable<boolean>;
  edgeColor: Writable<string>;
  labelBgColor: Writable<string>;
  labelTextColor: Writable<string>;
  noHandle: Writable<boolean>;
  type: Writable<string>;
}

export const nodeProps: NodeProps = {
  idNumber: writable(7),
  positionX: writable(250),
  positionY: writable(500),
  data: writable('New Node Name'),
  width: writable(100),
  height: writable(50),
  borderColor: writable('#F87171'),
  borderRadius: writable(3),
  bgColor: writable('#FFE4E6'),
  textColor: writable('#F87171'),
  sourcePosition: writable('bottom'),
  targetPosition: writable('top'),
  image: writable(false),
  src: writable(''),
  clickCallback: writable('node => console.log(node)')
};

export const edgeProps: EdgeProps = {
  id: writable(''),
  source: writable(6),
  target: writable(7),
  edgeLabel: writable('new edge label'),
  animate: writable(true),
  arrow: writable(true),
  edgeColor: writable('#F87171'),
  labelBgColor: writable('#FFE4E6'),
  labelTextColor: writable('#F87171'),
  noHandle: writable(),
  type: writable('bezier')
};

//variables to update from modal for node properties
export let idNumber = nodeProps.idNumber;
export let data = nodeProps.data;
export let positionX = nodeProps.positionX;
export let positionY = nodeProps.positionY;
export let width = nodeProps.width;
export let height = nodeProps.height;
export let borderColor = nodeProps.borderColor;
export let borderRadius = nodeProps.borderRadius;
export let bgColor = nodeProps.bgColor;
export let textColor = nodeProps.textColor;
export let sourcePosition = nodeProps.sourcePosition;
export let targetPosition = nodeProps.targetPosition;
export let image = nodeProps.image;
export let src = nodeProps.src;
export let clickCallback = nodeProps.clickCallback;

//variables to update from modal for edge properties
export let id = edgeProps.id;
export let source = edgeProps.source;
export let target = edgeProps.target;
export let edgeLabel = edgeProps.edgeLabel;
export let animate = edgeProps.animate;
export let arrow = edgeProps.arrow;
export let edgeColor = edgeProps.edgeColor;
export let labelBgColor = edgeProps.labelBgColor;
export let labelTextColor = edgeProps.labelTextColor;
export let noHandle = edgeProps.noHandle;
export let type = edgeProps.type;

//toggle modal form
export interface ToggleBools {
  inputToggle: Writable<boolean>;
  buildToggle: Writable<boolean>;
  advancedNodeToggle: Writable<boolean>;
  edgeToggle: Writable<boolean>;
  advancedEdgeToggle: Writable<boolean>;
  nodeToggle: Writable<boolean>;
  tipsToggle: Writable<boolean>;
  docsToggle: Writable<boolean>;
  copyToggle: Writable<boolean>;
}
export const toggleBools: ToggleBools = {
  inputToggle: writable(false),
  buildToggle: writable(false),
  advancedNodeToggle: writable(false),
  edgeToggle: writable(false),
  advancedEdgeToggle: writable(false),
  nodeToggle: writable(false),
  tipsToggle: writable(true),
  docsToggle: writable(false),
  copyToggle: writable(false)
};
export let inputToggle = toggleBools.inputToggle;
//build toggle for activating functionality in code mirror
export let buildToggle = toggleBools.buildToggle;
export let advancedEdgeToggle = toggleBools.advancedEdgeToggle;
export let edgeToggle = toggleBools.edgeToggle;
export let advancedNodeToggle = toggleBools.advancedNodeToggle;
export let nodeToggle = toggleBools.nodeToggle;
export let tipsToggle = toggleBools.tipsToggle;
export let docsToggle = toggleBools.docsToggle;
export let copyToggle = toggleBools.copyToggle;

//code mirror default code part 1
export const editStrP1 = writable(`<script>
import Svelvet from 'svelvet';
const initialNodes = [
  {
    id: 1,
    position: { x: 225, y: 10 },
    data: { label: 'Add Images!' },
    width: 100,
    height: 100,
    bgColor: 'white',
    borderColor: 'transparent',
    image: true,
    src: 'https://svelvet.io/_app/assets/Logo%201-cc7b0baf.svg'
  },
  {
    id: 2,
    position: { x: 390, y: 180 },
    data: { label: 'Mixed Anchors' },
    width: 125,
    height: 40,
    bgColor: 'white',
    targetPosition: 'left'
  },
  {
    id: 3,
    position: { x: 225, y: 260 },
    data: { label: 'Output Node' },
    width: 100,
    height: 40,
    bgColor: '#FFE4E6'
  },
  {
    id: 4,
    position: { x: 25, y: 180 },
    data: { label: 'Drag me!' },
    width: 125,
    height: 40,
    bgColor: 'white',
    targetPosition: 'right'
  },
  {
    id: 5,
    position: { x: 390, y: 380 },
    data: { label: 'Custom Node' },
    width: 125,
    height: 40,
    bgColor: '#C8FFC7',
    borderColor: 'transparent',
    borderRadius: 0
  },
  {
    id: 6,
    position: { x: 47.5, y: 360 },
    data: { label: 'Custom Node' },
    width: 80,
    height: 80,
    borderColor: '#FF4121',
    borderRadius: 30,
    bgColor: 'white',
    textColor: '#FF4121'
  },`);
//code mirror default code part 2
export const editStrP2 = writable(`];

const initialEdges = [
{ id: 'e1-2', source: 1, target: 2, label: 'edge label' },
{ id: 'e2-3', source: 2, target: 3, animate: true, label: 'animated edges' },
{ id: 'e1-4', source: 1, target: 4, type: 'step', animate: true, edgeColor: '#FF4121' },
{ id: 'e2-5', source: 2, target: 5, label: 'colored edges', animate: true, arrow: true, edgeColor: '#FF4121', labelBgColor: '#1F2937', labelTextColor: '#FFE4E6' },
{ id: 'e2-5', source: 4, target: 6, type: 'straight' },
{ id: 'e2-5', source: 3, target: 6, type: 'smoothstep', label: 'colored label', labelBgColor: '#FF4561', labelTextColor: 'white', animate: true },
`);

export const editStrP3 = `];
  </\script>
  
  <Svelvet nodes={initialNodes} edges={initialEdges} width={710} height={700} background={true} movement={true} />
    `;
