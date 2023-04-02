export type GraphKey = `G-${string}`;
export type NodeKey = `N-${string}/${GraphKey}`;
export type InputKey = `I-${string}/${NodeKey}`;
export type OutputKey = `O-${string}/${NodeKey}`;
export type ParameterKey = `P-${string}/${NodeKey}`;
export type EdgeKey = `${OutputKey}+${InputKey}`;
export type GroupKey = `${string}/${GraphKey}`;
