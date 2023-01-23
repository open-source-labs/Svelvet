import type { NodeType, EdgeType, AnchorType, StoreType } from './types';

/*
  `store` is a dictionary of Svelvet stores.
    * The reason why we have multiple Svelvet stores is to handle multiple canvases on the same page.
    * A Svelvet store is the single source of truth for a canvas state.
    * We discourage developers from interacting with stores directly; instead use the api methods in 
      `$lib/controllers/storeApi.ts`. However, if need to direct access you can do so by importing:
      `import { store } from '$lib/models/store';`
    *
*/
export const stores: { [key: string]: StoreType } = {};

export class Edge implements EdgeType {
  constructor(
    public id: string,
    public sourceX: number,
    public sourceY: number,
    public targetX: number,
    public targetY: number,
    public sourceAnchorId: string, // id of the anchor that is the "source" of the edge
    public targetAnchorId: string, // id of the anchor that is the "target" of the edge
    public canvasId: string,
    public label?: string,
    public type?: string,
    public labelBgColor?: string,
    public labelTextColor?: string,
    public edgeColor?: string,
    public animate?: boolean,
    public noHandle?: boolean,
    public arrow?: boolean
  ) {}

  // TODO: implement me
  handleDelete() {
    console.log('deleting edge not implemented yet');
  }
}

export class Anchor implements AnchorType {
  constructor(
    public id: string,
    public nodeId: string,
    public edgeId: string, // TODO: refactor this out
    public sourceOrTarget: 'source' | 'target',
    public positionX: number,
    public positionY: number,
    public callback: Function,
    public canvasId: string
  ) {}

  setPosition(movementX: number, movementY: number) {
    this.positionX += movementX;
    this.positionY += movementY;

    const { edgesStore } = stores[this.canvasId];

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
  constructor(
    public id: string,
    public positionX: number,
    public positionY: number,
    public width: number,
    public height: number,
    public bgColor: string,
    public data: string,
    public canvasId: string,
    public borderColor: string,
    public image: boolean,
    public src: string,
    public textColor: string,
    public borderRadius: number
  ) {}

  setPosition(movementX: number, movementY: number) {
    //update all necessary data
    this.positionX += movementX;
    this.positionY += movementY;

    //update all the anchors on the node in the anchorsStore
    const { anchorsStore } = stores[this.canvasId];

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
