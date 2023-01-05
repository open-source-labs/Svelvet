import { SvelteComponentTyped } from "svelte";
import type { Node, Edge } from '../types/types';
declare const __propDef: {
    props: {
        key: string;
        node: Node;
        position: string;
        role: string;
        width: number;
        height: number;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type EdgeAnchorProps = typeof __propDef.props;
export declare type EdgeAnchorEvents = typeof __propDef.events;
export declare type EdgeAnchorSlots = typeof __propDef.slots;
export default class EdgeAnchor extends SvelteComponentTyped<EdgeAnchorProps, EdgeAnchorEvents, EdgeAnchorSlots> {
}
export declare function renderEdge(e: {}): void;
export declare function renderNewNode(event: {}, edge: Edge): void;
export {};
