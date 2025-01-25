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

	const graph = getContext<Graph>('graph');
	const groupKey: GroupKey = `${$props.groupName}/${graph.id}`;

	setContext('group', groupKey);

	const writablePosition = writable($props.position);

	const groupBox: GroupBox = {
		group: writable(groupKey),
		dimensions: { width: writable($props.width), height: writable($props.height) },
		position: writablePosition,
		color: writable($props.color),
		moving: writable(false)
	};
	graph.groupBoxes.add(groupBox, groupKey);
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
