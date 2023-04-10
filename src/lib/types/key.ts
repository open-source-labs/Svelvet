export type GraphKey = `G-${string}`;
export type NodeKey = `N-${string}`;
export type ParameterKey = `P-${string}/${NodeKey}`;
export type EdgeKey = `${AnchorKey}+${AnchorKey}` | 'cursor';
export type GroupKey = `${string}/${GraphKey}` | 'selected' | 'hidden';

export type AnchorKey = `A-${string}`;

export type GenericKey = GraphKey | NodeKey | ParameterKey | EdgeKey | GroupKey | AnchorKey;
