export type GraphKey = `G-${string}`;
export type NodeKey = `N-${string}`;
export type InputKey = `I-${string}/${NodeKey}`;
export type OutputKey = `O-${string}/${NodeKey}`;
export type ParameterKey = `P-${string}/${NodeKey}`;
export type EdgeKey = `${OutputKey}+${InputKey}` | 'cursor';
export type GroupKey = `${string}/${GraphKey}` | 'selected' | 'hidden';

export type GenericKey =
	| GraphKey
	| NodeKey
	| InputKey
	| OutputKey
	| ParameterKey
	| EdgeKey
	| GroupKey;
