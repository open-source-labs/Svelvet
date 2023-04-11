<script lang="ts">
	import { onMount, setContext, getContext } from 'svelte';
	import type { Group, Graph, GroupBox, XYPair, CSSColorString, GroupKey } from '$lib/types';
	import { writable } from 'svelte/store';
	import { getRandomColor } from '$lib/utils';
	import { get } from 'svelte/store';

	export let width: number;
	export let height: number;
	export let position: XYPair;
	export let color: CSSColorString = getRandomColor();
	export let groupName: string | number;

	const graph = getContext<Graph>('graph');
	const groupKey: GroupKey = `${groupName}/${graph.id}`;

	setContext('group', groupKey);
	$: groupBoxes = graph.groupBoxes;
	$: groups = graph.groups;

	const writablePosition = {
		x: writable(position.x),
		y: writable(position.y)
	};

	const groupBox: GroupBox = {
		group: writable(groupKey),
		dimensions: { width: writable(width), height: writable(height) },
		position: writablePosition,
		color: writable(color),
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
