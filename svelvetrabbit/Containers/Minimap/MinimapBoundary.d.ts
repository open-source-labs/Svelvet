import { SvelteComponentTyped } from "svelte";
import type { Node, d3Translate } from "../../types/types";
import type { XYPosition } from "../../types/utils"
declare const __propDef: {
    props: {
        key: number;
        boundary: XYPosition;
        d3Translate: d3Translate;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};

export declare function handleClick(event: any): void;