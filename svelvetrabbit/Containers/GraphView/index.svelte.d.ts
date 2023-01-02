import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        nodesStore: any;
        derivedEdges: any;
        initialZoom: number;
        initialLocation: any;
        minimap: boolean;
        key: string;
    };
    events: {
        contextmenu: MouseEvent;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type IndexProps = typeof __propDef.props;
export declare type IndexEvents = typeof __propDef.events;
export declare type IndexSlots = typeof __propDef.slots;
export default class Index extends SvelteComponentTyped<IndexProps, IndexEvents, IndexSlots> {
}
export declare function zoomInit(): void;
export declare function determineD3Instance(): void;
export {};
