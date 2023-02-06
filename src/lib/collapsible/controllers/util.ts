import type {
  StoreType,
  UserEdgeType,
  UserNodeType,
} from '$lib/store/types/types';
import { Collapsible } from '../models/Collapsible';
import { v4 as uuidv4 } from 'uuid';
import type { CollapsibleType } from '../types/types';

export function populateCollapsibleStore(
  store: StoreType,
  userNodes: UserNodeType[],
  userEdges: UserEdgeType[],
  canvasId: string
) {
  const newCollapsibleStore: CollapsibleType[] = [];
  for (let userNode of userNodes) {
    const collapsible = new Collapsible(uuidv4(), userNode.id, 1);
    newCollapsibleStore.push(collapsible);
  }
  store.collapsible.set(newCollapsibleStore);
}
