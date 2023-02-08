import { SvelteComponentTyped } from "svelte";
import type { Node, Edge } from '../../types/index.js';
import type { XYPosition } from '../../types/utils.js'
declare const __propDef: {
    props: {
        nodes: Node[];
        edges: Edge[];
        width?: number | undefined;
        height?: number | undefined;
        background?: boolean | undefined;
        nodeLink?: boolean | undefined;
        nodeCreate?: boolean | undefined;
        nodeEdit?: boolean | undefined;
        movement?: boolean | undefined;
        snap?: boolean | undefined;
        snapTo?: number | undefined;
        bgColor?: string | undefined;
        initialLocation?: XYPosition | undefined;
        initialZoom?: number | undefined;
        minimap?: boolean | undefined;
        locked?: boolean | undefined;
        boundary?: boolean | XYPosition | undefined;
        shareable?: boolean | undefined;
        deleteNodes?: boolean| undefined;
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
