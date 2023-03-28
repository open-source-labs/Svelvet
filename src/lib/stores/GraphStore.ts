import type { Graph } from '$lib/types';
import { createStore } from '../utils/createStore';
import { writable } from 'svelte/store';

export const graphStore = createStore<Graph>();

export const source = writable(null);
