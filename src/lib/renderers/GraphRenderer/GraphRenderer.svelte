<script lang="ts">
	import GroupBoxRenderer from '$lib/renderers/GroupBoxRenderer/GroupBoxRenderer.svelte';
	import EdgeRenderer from '$lib/renderers/EdgeRenderer/EdgeRenderer.svelte';
	import ZoomPanWrapper from '$lib/containers/ZoomPanWrapper/ZoomPanWrapper.svelte';
	import type { Graph } from '$lib/types';
	import { initialClickPosition } from '$lib/stores/CursorStore';
	import { captureGroup, moveNodes } from '$lib/utils/movers';
	import { getContext } from 'svelte';
	import { get } from 'svelte/store';

	const graph = getContext<Graph>('graph');

	export let isMovable: boolean;

	$: activeGroup = graph.activeGroup;
	$: groups = graph.groups;
	$: initialNodePositions = graph.initialNodePositions;
	$: cursor = graph.cursor;
	$: transforms = graph.transforms;

	$: if ($activeGroup) {
		$cursor; // This is necessary to trigger the update
		moveNodes(graph, get(initialClickPosition), get(initialNodePositions), $activeGroup);
	}

	function handleGroupClicked(event: CustomEvent) {
		console.log('handleGroupClicked', event.detail);
		const { groupName } = event.detail;
		$activeGroup = groupName;
		$initialClickPosition = $cursor;
		$initialNodePositions = captureGroup($groups[groupName].nodes);
	}
</script>

<ZoomPanWrapper {isMovable}>
	<slot />
	<EdgeRenderer />
	<GroupBoxRenderer on:groupClick={handleGroupClicked} />
</ZoomPanWrapper>
