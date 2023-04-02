import type { Node } from '$lib/types';
import { createStore } from '$lib/utils';

export const nodeStore = createStore<Node>();
