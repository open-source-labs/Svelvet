import { SvelteComponentTyped } from "svelte";
import type { EdgeProps } from '../types/types';
declare const __propDef: {
    props: {
        baseEdgeProps: EdgeProps;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type BaseEdgeProps = typeof __propDef.props;
export declare type BaseEdgeEvents = typeof __propDef.events;
export declare type BaseEdgeSlots = typeof __propDef.slots;
export default class BaseEdge extends SvelteComponentTyped<BaseEdgeProps, BaseEdgeEvents, BaseEdgeSlots> {
}
export {};
