import type { Readable, Writable } from 'svelte/store';
import type { Node, Edge } from '../types/types';
import type { XYPosition } from '../types/utils';
interface CoreSvelvetStore {
    nodesStore: Writable<Node[]>;
    edgesStore: Writable<Edge[]>;
    widthStore: Writable<number>;
    heightStore: Writable<number>;
    backgroundStore: Writable<boolean>;
    movementStore: Writable<boolean>;
    nodeIdSelected: Writable<number>;
    nodeSelected: Writable<boolean>;
    d3Scale: Writable<number>;
    snapgrid: Writable<boolean>;
    snapResize: Writable<number>;
    backgroundColor: Writable<string>;
    hoveredElement: Writable<Node>;
    initZoom: Writable<number>;
    initLocation: Writable<XYPosition>;
    isLocked: Writable<boolean>;
}

interface SvelvetStore extends CoreSvelvetStore {
    onNodeMove: (e: any, nodeID: string | number) => void;
    onEdgeMove: (e: any, edgeID: string | number) => void;
    onNodeClick: (e: any, nodeID: string | number) => void;
    onTouchMove: (e: any, nodeID: string | number) => void;
    setAnchorPosition: (position: string, nodeWidth: number, nodeHeight: number, width: number, height: number) => number[];
    setNewEdgeProps: (role: string, position: string, node: Node) => number[];
    derivedEdges: Readable<Edge[]>;
}
export declare function findOrCreateStore(key: string): SvelvetStore;
export {};
