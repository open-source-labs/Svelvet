import { SvelteComponentTyped } from "svelte";
import type { DerivedEdge } from '../types/types';
declare const __propDef: {
    props: {
        edge: DerivedEdge;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type StraightEdgeProps = typeof __propDef.props;
export declare type StraightEdgeEvents = typeof __propDef.events;
export declare type StraightEdgeSlots = typeof __propDef.slots;
export default class StraightEdge extends SvelteComponentTyped<StraightEdgeProps, StraightEdgeEvents, StraightEdgeSlots> {
}
export {};
