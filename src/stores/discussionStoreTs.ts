import { writable } from 'svelte/store'
import type { Readable, Writable } from 'svelte/store';

interface discussionStore {
    subject: Writable<string>;
    body: Writable<string>;
    created_at: Date

};

export const discussionStore: discussionStore = {

};