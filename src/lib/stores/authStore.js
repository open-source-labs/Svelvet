import { writable } from 'svelte/store'

export let user = writable(null);
export let logged_in = writable(false);
export let user_avatar = writable(null);
export let user_name = writable(null);
export let user_email = writable(null);

// create variable user projects that will be updated when we see that there is a user that's logged in
export let diagrams = writable([]);
