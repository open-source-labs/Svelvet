import type { AnchorKey, EdgeKey } from '$lib/types';

export function sortEdgeKey(keyOne: AnchorKey, keyTwo: AnchorKey): EdgeKey {
	// Sort the strings alphabetically
	const sortedStrings = [keyOne, keyTwo].sort();

	// Concatenate the sorted strings
	const combinedString: EdgeKey = `${sortedStrings[0]}+${sortedStrings[1]};`;

	return combinedString;
}
