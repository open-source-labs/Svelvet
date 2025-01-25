<!-- @migration-task Error while migrating Svelte code: Cannot use rune without parentheses
https://svelte.dev/e/rune_missing_parentheses -->
<!-- @migration-task Error while migrating Svelte code: Cannot use rune without parentheses
https://svelte.dev/e/rune_missing_parentheses -->
<script lang="ts">
	import { setContext, getContext } from 'svelte';
	import type { Group, Graph, GroupBox, XYPair, CSSColorString, GroupKey } from '$lib/types';
	import { writable } from 'svelte/store';
	import { getRandomColor } from '$lib/utils';

	$props = {
		width: 0,
		height: 0,
		position: null,
		color: getRandomColor(),
		groupName: ''
	};

	// Get the graph context
	const graph = getContext<Graph>('graph');
	const groupKey: GroupKey = `${$props.groupName}/${graph.id}`;

	// Set the group context
	setContext('group', groupKey);

	// Create a writable store for the position
	const writablePosition = writable($props.position);

	// Create a group box object
	const groupBox: GroupBox = {
		group: writable(groupKey),
		dimensions: { width: writable($props.width), height: writable($props.height) },
		position: writablePosition,
		color: writable($props.color),
		moving: writable(false)
	};

	// Add the group box to the graph's group boxes
	graph.groupBoxes.add(groupBox, groupKey);

	// Update the graph's groups with the new group
	graph.groups.update((groups) => {
		const newGroup: Group = {
			parent: writable(groupBox),
			nodes: writable(new Set([groupBox]))
		};
		groups[groupKey] = newGroup;
		return groups;
	});
</script>

<slot />
