import { SvelteComponentTyped } from "svelte";
import type { Node } from '../types/types';
declare const __propDef: {
    props: {
        node: Node;
        key: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type ImageNodeProps = typeof __propDef.props;
export declare type ImageNodeEvents = typeof __propDef.events;
export declare type ImageNodeSlots = typeof __propDef.slots;
export default class ImageNode extends SvelteComponentTyped<ImageNodeProps, ImageNodeEvents, ImageNodeSlots> {
}
export {};
