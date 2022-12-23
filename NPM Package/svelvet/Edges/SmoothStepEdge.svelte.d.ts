import { SvelteComponentTyped } from "svelte";
import { Position } from '../types/utils';
import type { DerivedEdge } from '../types';
declare const __propDef: {
    props: {
        getSmoothStepPath?: (({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, borderRadius, centerX, centerY }: {
            sourceX: number;
            sourceY: number;
            sourcePosition?: Position | undefined;
            targetX: number;
            targetY: number;
            targetPosition?: Position | undefined;
            borderRadius?: number | undefined;
            centerX?: number | undefined;
            centerY?: number | undefined;
        }) => string) | undefined;
        edge: DerivedEdge;
        borderRadius?: number | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type SmoothStepEdgeProps = typeof __propDef.props;
export declare type SmoothStepEdgeEvents = typeof __propDef.events;
export declare type SmoothStepEdgeSlots = typeof __propDef.slots;
export default class SmoothStepEdge extends SvelteComponentTyped<SmoothStepEdgeProps, SmoothStepEdgeEvents, SmoothStepEdgeSlots> {
    get getSmoothStepPath(): ({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, borderRadius, centerX, centerY }: {
        sourceX: number;
        sourceY: number;
        sourcePosition?: Position | undefined;
        targetX: number;
        targetY: number;
        targetPosition?: Position | undefined;
        borderRadius?: number | undefined;
        centerX?: number | undefined;
        centerY?: number | undefined;
    }) => string;
}
export {};
