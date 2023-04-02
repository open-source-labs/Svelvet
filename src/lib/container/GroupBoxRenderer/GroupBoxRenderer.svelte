<script lang="ts">
	import type { Graph } from '$lib/types';
	import GroupBoundingBox from '$lib/components/GroupBoundingBox/GroupBoundingBox.svelte';
	import { getContext } from 'svelte';

	const graph = getContext<Graph>('graph');

	$: groupBoxes = graph.groupBoxes;
</script>

{#each Object.entries($groupBoxes) as [id, group] (id)}
	<GroupBoundingBox on:groupClick {...group} groupName={id} />
{/each}
