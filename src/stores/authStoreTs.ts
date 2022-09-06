import { writable } from 'svelte/store'
import type { Readable, Writable } from 'svelte/store';

interface userInfoStore {
  user: Writable<{} | null>;
  logged_in: Writable<boolean>;
  user_avatar: Writable<string>; // url to avatar img is a string
  user_name: Writable<string>;
  user_email: Writable<string>;
  diagrams: Writable<any[]>;
}
// create variable user projects that will be updated when we see that there is a user that's logged in
export const userInfoStore: userInfoStore = {
  user: writable(null),
  logged_in: writable(false),
  user_avatar: writable(""), // url to avatar img is a string
  user_name: writable(""),
  user_email: writable(""),
  diagrams: writable([]),
}