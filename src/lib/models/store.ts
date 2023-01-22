import { writable, derived, get, readable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';
import type { NodeType, EdgeType, AnchorType } from './types';

/*
Type for a single svelvet store
The reason why we put svelvetStoreType in store.ts and not in types.ts is because
developers should not be interacting with the store directly, and thus should not have
need of svelvetStoreType outside of store.ts
*/
interface svelvetStoreType {
  nodesStore: Writable<{ [key: string]: NodeType }>;
  edgesStore: Writable<{ [key: string]: EdgeType }>;
  anchorsStore: Writable<{ [key: string]: AnchorType }>;
}

/*
  `store` is a dictionary of Svelvet stores.
    * The reason why we have multiple Svelvet stores is to handle multiple canvases on the same page.
    * A Svelvet store is the single source of truth for a canvas state.
    * We discourage developers from interacting with stores directly; instead use the api methods in 
      `$lib/controllers/storeApi.ts`. However, if need to direct access you can do so by importing:
      `import { store } from '$lib/models/store';`
*/
export const store: svelvetStoreType = createStore();
function createStore() {
  return {
    nodesStore: writable({}),
    edgesStore: writable({}),
    anchorsStore: writable({}),
  };
}

export class Edge implements EdgeType {
  id: string;
  sourceAnchorId: string;
  targetAnchorId: string;
  sourceId: number;
  targetId: number;
  type: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;

  constructor(
    id: string,
    sourceId: number,
    targetId: number,
    type: string,
    sourceX: number,
    sourceY: number,
    targetX: number,
    targetY: number,
    sourceAnchorId: string,
    targetAnchorId: string
  ) {
    this.id = id;
    //surce is the id of the source node
    this.sourceId = sourceId;
    //target is the id of the target node
    this.targetId = targetId;
    this.sourceX = sourceX;
    this.sourceY = sourceY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.type = type;
    this.sourceAnchorId = sourceAnchorId;
    this.targetAnchorId = targetAnchorId;
  }

  // TODO: implement me
  handleDelete() {
    console.log('deleting edge not implemented yet');
  }
}

export class Anchor implements AnchorType {
  id: string;
  nodeId: string;
  edgeId: string;
  sourceOrSink: string;
  positionX: number;
  positionY: number;
  callback: Function;

  constructor(
    id: string,
    nodeId: string,
    edgeId: string,
    sourceOrSink: string,
    positionX: number,
    positionY: number,
    callback: Function
  ) {
    this.id = id;
    this.nodeId = nodeId;
    this.edgeId = edgeId;
    this.sourceOrSink = sourceOrSink;
    this.positionX = positionX;
    this.positionY = positionY;
    this.callback = callback;
  }

  setPosition(movementX: number, movementY: number) {
    this.positionX += movementX;
    this.positionY += movementY;
    //call edge

    const { edgesStore } = store;

    edgesStore.update((edges) => {
      for (const key in edges) {
        if (edges[key].sourceAnchorId === this.id) {
          edges[key].sourceX += movementX;
          edges[key].sourceY += movementY;
        }
        if (edges[key].targetAnchorId === this.id) {
          edges[key].targetX += movementX;
          edges[key].targetY += movementY;
        }
      }
      return { ...edges };
    });
  }

  // TODO: implement me
  handleDelete() {
    console.log('anchor deletion not yet implemented');
  }
}

export class Node implements NodeType {
  id: string;
  userLabel: number;
  width: number;
  height: number;
  positionX: number;
  positionY: number;
  bgColor: string;
  data: string;

  constructor(
    id: string,
    userLabel: number,
    positionX: number,
    positionY: number,
    width: number,
    height: number,
    bgColor: string,
    data: string
  ) {
    this.id = id;
    this.userLabel = userLabel;
    this.positionX = positionX;
    this.positionY = positionY;
    this.width = width;
    this.height = height;
    this.bgColor = bgColor;
    this.data = data;
  }

  setPosition(movementX: number, movementY: number) {
    //update all necessary data
    this.positionX += movementX;
    this.positionY += movementY;

    //update all the anchors on the node in the anchorsStore
    const { anchorsStore } = store;
    //const originalAnchorStore = get(anchorsStore)

    anchorsStore.update((anchors) => {
      for (const key in anchors) {
        if (anchors[key].nodeId === this.id) {
          // console.log('trying to update the anchorsStore')
          anchors[key].setPosition(movementX, movementY);
        }
      }
      return { ...anchors };
    });
  }

  // TODO: implement me
  handleDelete() {
    console.log('node deletion not yet implemented');
  }
}
