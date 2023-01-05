export declare enum Position {
    Left = "left",
    Right = "right",
    Top = "top",
    Bottom = "bottom"
}
export interface XYPosition {
    x: number;
    y: number;
}
export declare type XYZPosition = XYPosition & {
    z: number;
};
export interface Dimensions {
    width: number;
    height: number;
}
export interface Rect extends Dimensions, XYPosition {
}
export interface Box extends XYPosition {
    x2: number;
    y2: number;
}
export declare type Transform = [number, number, number];
