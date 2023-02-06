import { SvelteComponentTyped } from "svelte";
import type { Node, d3Translate } from "../../types/types";
declare const __propDef: {
    props: {
        key: string;
        d3Translate: d3Translate;
        
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};

export declare function scaleW(v: number): void;
export declare function scaleH(v: number): void;
export declare function handleClick(event: any): void;