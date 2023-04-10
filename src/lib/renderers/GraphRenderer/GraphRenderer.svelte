<script lang="ts">
	import GroupBoxRenderer from '$lib/renderers/GroupBoxRenderer/GroupBoxRenderer.svelte';
	import EdgeRenderer from '$lib/renderers/EdgeRenderer/EdgeRenderer.svelte';
	import ZoomPanWrapper from '$lib/containers/ZoomPanWrapper/ZoomPanWrapper.svelte';
	import type { Graph } from '$lib/types';
	import { initialClickPosition } from '$lib/stores/CursorStore';
	import { captureGroup, moveNodes, updateTranslation } from '$lib/utils';
	import { getContext } from 'svelte';
	import { getJSONState } from '$lib/utils/savers/saveStore';
	import { get } from 'svelte/store';
	const graph = getContext<Graph>('graph');

	export let isMovable: boolean;

	$: activeGroup = graph.activeGroup;
	$: groups = graph.groups;
	$: initialNodePositions = graph.initialNodePositions;
	$: cursor = graph.cursor;
	$: transforms = graph.transforms;
	$: x = transforms.translation.x;
	$: y = transforms.translation.y;

	$: if ($activeGroup) {
		$cursor; // This is necessary to trigger the update
		moveNodes(graph, get(initialClickPosition), get(initialNodePositions), $activeGroup);
	}

	function handleGroupClicked(event: CustomEvent) {
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
