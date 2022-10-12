import { SvelteComponentTyped } from "svelte";
import type { Node, Edge } from '../../types/index.js';
declare const __propDef: {
    props: {
        nodes: Node[];
        edges: Edge[];
        width?: number | undefined;
        height?: number | undefined;
        background?: boolean | undefined;
        movement?: boolean | undefined;
        snap?: boolean | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type IndexProps = typeof __propDef.props;
export declare type IndexEvents = typeof __propDef.events;
export declare type IndexSlots = typeof __propDef.slots;
export default class Index extends SvelteComponentTyped<IndexProps, IndexEvents, IndexSlots> {
}
export {};
