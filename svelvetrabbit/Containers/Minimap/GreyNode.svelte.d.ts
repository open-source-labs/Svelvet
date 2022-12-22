import { SvelteComponentTyped } from "svelte";
import type { Node } from '../../types/types'
declare const __propDef: {
    props: {
        node: Node;
        key: string;
        heightRatio: number;
        widthRatio: number;
        nodeXleftPosition: number;
        nodeYbottomPosition: number;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};