import { writable, derived, get, readable } from 'svelte/store';
import type {Readable, Writable } from 'svelte/store';

// import type { Node, Edge } from '../types/types';
/**
 *  When a user install svelvet package into their repo and import Svelvet from Svelvet,
 *  To create a node, the user needs to provide the following information:
 *  [{id, position {x, y}, data, width, height, bgColor}, {}] all required
 *  The position x, y is for the left top corner of the node
 * 
 * 
 *  To create an edge, the user needs to provide the following information:
 *  {id, source, target} required
 *  {label, labelTextColor, labelBgColor, animate, type, arrow, edgeColor} optional
 *  For now, only focus on the required information for edges
 * 
 * 
 *  1. We do not want to change the information our user needs to provide to create a node or an edge
 *  2. Is it possible to do OOP for node and edge?
 *  3. Situations for node: Node created / Node moved / Node deleted
 *  4. Situations for edge: Edge created / Edge deleted
 *  
 */

interface testingCoreStore {
    nodesStore: Writable<{[key: string]: Node}>
    edgesStore: Writable<{[key: string]: Edge}>
    anchorsStore: Writable<{[key: string]: Anchor}>
}

interface NodeType {
    id: string,
    width: number,
    height: number,
    positionX: number,
    positionY: number,
    bgColor: string,
    data: string,
}

interface EdgeType {
    id: string,
    type: string,
    targetId: number,
    sourceId: number,
    
}

interface AnchorType {
    id: string,
    nodeId: string,
    edgeId: string,
    sourceOrSink: string,
    positionX: number,
    positionY: number,
    callback: Function,
}

// this is the "global" store that anybody can access
// think of it like a database
let store
export function findStore() {
    if (store===undefined) throw 'store not set yet'
    return store
}

// Creates a store and assigns it to a "global" variable "store"
// so that other components can use it
export function createStore() {
    const testingCoreStore: testingCoreStore = {
        nodesStore: writable({}),
        edgesStore: writable({}),
        anchorsStore: writable({}),
    }
    store = testingCoreStore
    return store;
}

export class Edge implements EdgeType {
    id: string;
    sourceId: number;
    targetId: number;
    type:string;

    constructor(id:string, sourceId:number, targetId:number, type:string) {
        this.id = id;
        //surce is the id of the source node
        this.sourceId = sourceId;
        //target is the id of the target node
        this.targetId = targetId;
        this.type = type;
    }

    handleDelete() {
        console.log('Edge handleDelete fired')
    }
} 

//refactore the nodeStore from array to object

export class Anchor implements AnchorType {
    id: string;
    nodeId: string;
    edgeId: string;
    sourceOrSink: string;
    positionX: number;
    positionY: number;
    callback: Function;
    
    constructor(id: string, nodeId: string, edgeId: string, sourceOrSink: string, positionX: number, positionY: number, callback: Function) {
        this.id = id;
        this.nodeId = nodeId;
        this.edgeId = edgeId;
        this.sourceOrSink = sourceOrSink;
        this.positionX = positionX;
        this.positionY = positionY;
        this.callback = callback;
    }

    getNodeInfo() {
        console.log('this function should get node info')
    }
}

export class Node implements NodeType {
    id: string
    width: number
    height: number
    positionX: number
    positionY: number
    bgColor: string
    data: string

    constructor(id:string, positionX:number, positionY:number, width:number, height:number, bgColor:string, data:string) {
        this.id = id;
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
        const store = findStore();
        const { anchorsStore } = store;
        //const originalAnchorStore = get(anchorsStore)

        anchorsStore.update((anchors) => {
            for (const key in anchors) {
                if (anchors[key].nodeId === this.id) {
                    // console.log('trying to update the anchorsStore')
                    anchors[key].positionX += movementX;
                    anchors[key].positionY += movementY;
                }
            }
            return {...anchors}
        })
    }

    handleDelete() {
        console.log('Node handleDelete fired')
    }
}

