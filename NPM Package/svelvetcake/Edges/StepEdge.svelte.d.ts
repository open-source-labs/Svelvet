import { SvelteComponentTyped } from "svelte";
import type { DerivedEdge } from '../types';
declare const __propDef: {
    props: {
        edge: DerivedEdge;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type StepEdgeProps = typeof __propDef.props;
export declare type StepEdgeEvents = typeof __propDef.events;
export declare type StepEdgeSlots = typeof __propDef.slots;
export default class StepEdge extends SvelteComponentTyped<StepEdgeProps, StepEdgeEvents, StepEdgeSlots> {
}
export {};
