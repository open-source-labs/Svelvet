import { SvelteComponentTyped } from "svelte";
import type { XYPosition } from "../../types/utils"
declare const __propDef: {
    props: {
        nodesStore: any;
        derivedEdges: any;
        initialZoom: number;
        initialLocation: XYPosition;
        minimap: boolean;
        key: string;
        width: number;
        height: number;
        boundary: XYPosition;
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
export declare function miniMapClick(event: any): void;
export declare function uploadStore(e: MouseEvent): void;
export declare function makeTextFile(text: string): any;
export {};
