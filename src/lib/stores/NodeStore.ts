import type { Node } from '$lib/types';
import { createStore } from '../utils/createStore';

export const nodeStore = createStore<Node>();
