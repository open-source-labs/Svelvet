export interface Node {
  id: string,
  data: {content?: string, shape: string, props?: any},
  type: string,
  children: Array<{node: Node, shape: string, content?: string}>
  parents: Array<{node: Node}>
}

export type NodeArray = Array<Node>

export interface FlowChart {
  parentNodes: NodeArray,
  nodeList: {[key: string] : Node}
}

export interface Edge {
  shape: string,
  content?: string,
  length: number
}
