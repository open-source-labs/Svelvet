const arrowTuple = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'] as const;
const arrows = new Set(arrowTuple);

export type Arrow = (typeof arrowTuple)[number];
export const isArrow = (key: string): key is Arrow => arrows.has(key as Arrow);
