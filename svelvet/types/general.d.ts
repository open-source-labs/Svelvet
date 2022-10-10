export declare type SvelvetInitialState = {};
export declare type Viewport = {
    x: number;
    y: number;
    zoom: number;
};
export interface Connection {
    source: string | null;
    target: string | null;
    sourceHandle: string | null;
    targetHandle: string | null;
}
