import type { DataObject } from '$lib/types';
import { createStore } from '../utils/createStore';

export const dataStore = createStore<DataObject>();
