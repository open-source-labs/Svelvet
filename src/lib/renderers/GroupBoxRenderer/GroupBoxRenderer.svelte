<script lang="ts">
	import type { Graph } from '$lib/types';
	import GroupBoundingBox from '$lib/components/Group/GroupBoundingBox.svelte';
	import { getContext } from 'svelte';

	const graph = getContext<Graph>('graph');

	const groupBoxes = graph.groupBoxes;

	function handleGroupClick(event: CustomEvent) {
		const { groupName } = event.detail;
		// Handle the group click event here
	}
</script>

{#each Array.from($groupBoxes) as [id, group] (id)}
	<GroupBoundingBox {...group} groupName={id} groupClick={handleGroupClick} />
{/each}
