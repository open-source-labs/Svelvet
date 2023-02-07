import { Position } from '../types/utils';
export interface GetCenterParams {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    sourcePosition?: Position;
    targetPosition?: Position;
}
export declare const getCenter: ({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }: GetCenterParams) => [number, number, number, number];
