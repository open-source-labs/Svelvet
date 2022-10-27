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
export declare type SimpleBezierEdgeProps = typeof __propDef.props;
export declare type SimpleBezierEdgeEvents = typeof __propDef.events;
export declare type SimpleBezierEdgeSlots = typeof __propDef.slots;
export default class SimpleBezierEdge extends SvelteComponentTyped<SimpleBezierEdgeProps, SimpleBezierEdgeEvents, SimpleBezierEdgeSlots> {
}
export {};
