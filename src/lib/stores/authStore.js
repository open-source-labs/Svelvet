import { writable } from 'svelte/store'

export let user = writable(null);
export let logged_in = writable(false);