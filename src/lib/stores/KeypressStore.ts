import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { ActiveKeys } from '../types/general';

export const activeKeys: Writable<ActiveKeys> = writable({});
