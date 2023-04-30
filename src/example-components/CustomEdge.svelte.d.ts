import { SvelteComponentTyped } from 'svelte';
declare const __propDef: {
	props: Record<string, never>;
	events: {
		[evt: string]: CustomEvent<any>;
	};
	slots: {};
};
export type CustomEdgeProps = typeof __propDef.props;
export type CustomEdgeEvents = typeof __propDef.events;
export type CustomEdgeSlots = typeof __propDef.slots;
export default class CustomEdge extends SvelteComponentTyped<
	CustomEdgeProps,
	CustomEdgeEvents,
	CustomEdgeSlots
> {}
export {};
