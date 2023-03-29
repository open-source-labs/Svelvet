import type { Node, NodeArray, FlowChart, Edge } from "../types/parser";

const shapeRef = {'(' : 'round', '([' : 'stadium', '[[' : 'subroutine', '[(' : 'cylindrical', '((' : 'circle', '{' : 'rhombus', '{{' : 'hexagon'};
const edgeRef = {'-' : 'straight', "~" : 'bezier'};
const bracketRef = {'(' : ')', '[' : ']', '{' : '}'};
const edgeRegex = /[-=~]*>(?:\s*\|(.+?)\|)?/g;


export const flowChartParser = (lines: Array<string>) => {
  const flowChart: FlowChart = {parentNodes : [], nodeList : {}};
  // parse mermaid string line by line
  for (const line of lines) {
    const {parentNodes, childNodes, edge} = parseLine(line);
    for (const parentNode of parentNodes) {
      // if a parent or child exists in our flow chart, then we add to their respective parent and child node arrays, otherwise we add their relational nodes then add to the flow chart
      if (!flowChart.nodeList[parentNode.id]) flowChart.parentNodes.push(parentNode);
      for (const childNode of childNodes) {
        if (flowChart.nodeList[parentNode.id]) flowChart.nodeList[parentNode.id].children.push({node: flowChart.nodeList[childNode.id] || childNode, ...edge});
        else {
          parentNode.children.push({node: flowChart.nodeList[childNode.id] || childNode, ...edge});
          flowChart.nodeList[parentNode.id] = parentNode;
        }
        if (flowChart.nodeList[childNode.id]) flowChart.nodeList[childNode.id].parents.push({node: flowChart.nodeList[parentNode.id] || parentNode});
        else {
          childNode.parents.push({node: flowChart.nodeList[parentNode.id] || parentNode});
          flowChart.nodeList[childNode.id] = childNode;
        }
        // remove any of the child nodes being added as a top level parent node
        flowChart.parentNodes = flowChart.parentNodes.filter((node) => node.id !== childNode.id);
      }
    }
  }
  return flowChart;
}

const parseLine = (line: string) => {
  const parentNodes: NodeArray = [];
  const childNodes: NodeArray = [];
  const trimmedLine = line.trim();
  let edgeString = '';
  // regex here will match any edge type along with its content if provided. that edge is then used to split the line into parent and child nodes
  const edgeStringArray = trimmedLine.match(edgeRegex);
  if (edgeStringArray) edgeString = edgeStringArray[0];
  else throw new Error('Invalid edge');
  const [parentNodesString, childNodesString] = trimmedLine.split(edgeString);
  for (const parentNode of parentNodesString.split('&')) parentNodes.push(nodeParser(parentNode));
  for (const childNode of childNodesString.split('&')) childNodes.push(nodeParser(childNode));
  const edge: Edge = edgeParser(edgeString);
  return {parentNodes, childNodes, edge};
}

const nodeParser = (node: string) => {
  node = node.trim();
  let id = '';
  let shape = '';
  const data: Node['data'] = {shape: ''};
  const bracketStack: Array<string> = [];
  let [label, type, props] = node.split('|');
  for (let i = 0; i < label.length; i++) {
    if (bracketRef[label[i]]) bracketStack.push(label[i]);
    else if (bracketRef[bracketStack[bracketStack.length - 1]] === label[i]) {
      shape = shapeRef[bracketStack.join('')];
      break;
    } else id += label[i];   
  }
  if (!shape) shape = 'default';
  data.shape = shape;
  if (!type) type = 'Default';
  if (!props) data.content = id;
  else data.props = props;
  return {id, data, type, children : [], parents: []};
}

const edgeParser = (edge: string) => {
  edge = edge.trim();
  let shape = '';
  const [edgeLine, content] = edge.split('|');
  if (edgeRef[edgeLine[0]]) shape = edgeRef[edgeLine[0]];
  else throw new Error('Not a valid edge type');
  if (content) return {shape, content: content.trim(), length: edgeLine.trim().length}
  else return {shape, length: edgeLine.trim().length}
}
