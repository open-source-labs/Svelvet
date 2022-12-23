import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        x: number;
        y: number;
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
export {};
