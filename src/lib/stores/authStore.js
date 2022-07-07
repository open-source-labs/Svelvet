import { writable } from 'svelte/store'

export let user = writable(null);
export let logged_in = writable(false);
export let user_avatar = writable(null);
export let user_name = writable(null);
