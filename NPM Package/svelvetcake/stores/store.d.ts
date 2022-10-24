import type { Readable, Writable } from 'svelte/store';
import type { Node, Edge } from '../types/types';
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
}
interface SvelvetStore extends CoreSvelvetStore {
    onMouseMove: (e: any, nodeID: number) => void;
    onNodeClick: (e: any, nodeID: number) => void;
    onTouchMove: (e: any, nodeID: number) => void;
    derivedEdges: Readable<Edge[]>;
}
export declare function findOrCreateStore(key: string): SvelvetStore;
export {};
