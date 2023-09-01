<script lang="ts">
	import type { Graph } from '$lib/types';
	import GroupBoundingBox from '$lib/components/Group/GroupBoundingBox.svelte';
	import { getContext } from 'svelte';

	const graph = getContext<Graph>('graph');

	const groupBoxes = graph.groupBoxes;
</script>

{#each Array.from($groupBoxes) as [id, group] (id)}
	<GroupBoundingBox
		on:groupClick
		dimensions={group.dimensions}
		position={group.position}
		color={group.color}
		groupName={id}
		locked={group.locked}
	/>
{/each}
