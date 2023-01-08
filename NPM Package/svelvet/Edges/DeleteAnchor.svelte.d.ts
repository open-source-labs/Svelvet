import { SvelteComponentTyped } from "svelte";
import type { Node, Edge } from '../types/types';
declare const __propDef: {
    props: {
        key: string;
        node: Node;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type DeleteAnchorProps = typeof __propDef.props;
export declare type DeleteAnchorEvents = typeof __propDef.events;
export declare type DeleteAnchorSlots = typeof __propDef.slots;
export default class DeleteAnchor extends SvelteComponentTyped<EdgeAnchorProps, EdgeAnchorEvents, EdgeAnchorSlots> {
}

export {};
