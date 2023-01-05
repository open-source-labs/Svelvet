import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        key: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type EditModalProps = typeof __propDef.props;
export declare type EditModalEvents = typeof __propDef.events;
export declare type EditModalSlots = typeof __propDef.slots;
export declare function editNode(e: any): void;
export declare function changeLabel(e: any): void;

export default class EditModal extends SvelteComponentTyped<EditModalProps, EditModalEvents, EditModalSlots> {
}
export {};