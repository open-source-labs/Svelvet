import type { StoreType } from '../../store/types/types';
import { get } from 'svelte/store';

/**
 * getPotentialAnchorById will look for the targeted potential Anchor that has the same id provided in the Svelvet component store.
 *
 * @param store The Svelvet store containing the state of a Svelvet component
 * @param id The id of the targeted potential Anchor
 * @returns The targeted potential Anchor object in store.potentialAnchorsStore
 */
export function getPotentialAnchorById(store: StoreType, id: string) {
  const potentialAnchorsStore = get(store.potentialAnchorsStore);
  const potentialAnchor = potentialAnchorsStore[id];
  if (potentialAnchor === undefined) throw 'potential anchor not found';
  return potentialAnchor;
}
