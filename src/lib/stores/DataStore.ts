import type { DataObject } from '$lib/types';
import { createStore } from '$lib/utils';

export const dataStore = createStore<DataObject>();
