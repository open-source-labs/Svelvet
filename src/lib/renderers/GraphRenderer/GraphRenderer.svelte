<script lang="ts">
	import NodeRenderer from '$lib/renderers/NodeRenderer/NodeRenderer.svelte';
	import GroupBoxRenderer from '$lib/renderers/GroupBoxRenderer/GroupBoxRenderer.svelte';
	import EdgeRenderer from '$lib/renderers/EdgeRenderer/EdgeRenderer.svelte';
	import ZoomPanWrapper from '$lib/containers/ZoomPanWrapper/ZoomPanWrapper.svelte';
	import type { Graph } from '$lib/types';
	import { initialClickPosition } from '$lib/stores/CursorStore';
	import { captureGroup, moveNodes, updateTranslation } from '$lib/utils';
	import { getContext } from 'svelte';
	import { getJSONState } from '$lib/utils/savers/saveStore';
	const graph = getContext<Graph>('graph');
	export let isMovable: boolean;

	$: activeGroup = graph.activeGroup;
	$: groups = graph.groups;

	$: initialNodePositions = graph.initialNodePositions;
	$: cursor = graph.cursor;
	$: transforms = graph.transforms;
	$: x = transforms.translation.x;
	$: y = transforms.translation.y;

	$: if (isMovable) {
		[$x, $y] = updateTranslation($initialClickPosition, $cursor, transforms);
	}

	$: if ($activeGroup) {
		$cursor; // This is necessary to trigger the update
		moveNodes(graph, $initialClickPosition, $initialNodePositions, $activeGroup);
	}

	function handleGroupClicked(event: CustomEvent) {
		const { groupName } = event.detail;
		$activeGroup = groupName;
		$initialClickPosition = $cursor;
		$initialNodePositions = captureGroup($groups[groupName].nodes);
	}
</script>

<ZoomPanWrapper>
	<NodeRenderer><slot /></NodeRenderer>
	<EdgeRenderer />
	<GroupBoxRenderer on:groupClick={handleGroupClicked} />
</ZoomPanWrapper>

<style>
</style>
