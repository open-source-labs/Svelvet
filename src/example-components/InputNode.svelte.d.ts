import { SvelteComponent } from 'svelte';
declare const __propDef: {
	props: Record<string, never>;
	events: {
		[evt: string]: CustomEvent<any>;
	};
	slots: {};
};
export type InputNodeProps = typeof __propDef.props;
export type InputNodeEvents = typeof __propDef.events;
export type InputNodeSlots = typeof __propDef.slots;
export default class InputNode extends SvelteComponent<
	InputNodeProps,
	InputNodeEvents,
	InputNodeSlots
> {}
export {};
