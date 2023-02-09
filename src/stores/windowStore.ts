import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'


interface windowStore {
  width: Writable< number | null >
  height: Writable< number | null >
  scrollY: Writable< number | null >
  scrollX: Writable< number | null >
}

export const windowStore: windowStore = {
  width: writable(null),
  height: writable(null),
  scrollY: writable(null),
  scrollX: writable(null)
}