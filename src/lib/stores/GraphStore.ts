import type { Graph } from '$lib/types';
import { createStore } from '../utils/createStore';

export const graphStore = createStore<Graph>();
