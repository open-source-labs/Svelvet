import { SvelteComponentTyped } from "svelte";
import type { EdgeTextProps } from '../types/types';
declare const __propDef: {
    props: {
        edgeTextProps: EdgeTextProps;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type EdgeTextProps = typeof __propDef.props;
export declare type EdgeTextEvents = typeof __propDef.events;
export declare type EdgeTextSlots = typeof __propDef.slots;
export default class EdgeText extends SvelteComponentTyped<EdgeTextProps, EdgeTextEvents, EdgeTextSlots> {
}
export {};
