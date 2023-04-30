import { SvelteComponentTyped } from 'svelte';
declare const __propDef: {
	props: Record<string, never>;
	events: {
		[evt: string]: CustomEvent<any>;
	};
	slots: {};
};
export type CustomNodeProps = typeof __propDef.props;
export type CustomNodeEvents = typeof __propDef.events;
export type CustomNodeSlots = typeof __propDef.slots;
export default class CustomNode extends SvelteComponentTyped<
	CustomNodeProps,
	CustomNodeEvents,
	CustomNodeSlots
> {}
export {};
