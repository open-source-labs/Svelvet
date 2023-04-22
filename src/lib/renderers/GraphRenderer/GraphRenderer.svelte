<script lang="ts">
	import GroupBoxRenderer from '$lib/renderers/GroupBoxRenderer/GroupBoxRenderer.svelte';
	import EdgeRenderer from '$lib/renderers/EdgeRenderer/EdgeRenderer.svelte';
	import ZoomPanWrapper from '$lib/containers/ZoomPanWrapper/ZoomPanWrapper.svelte';
	import { initialClickPosition, tracking } from '$lib/stores/CursorStore';
	import { captureGroup, moveNodes } from '$lib/utils/movers/';
	import { getContext, onMount } from 'svelte';
	import type { Graph } from '$lib/types';

	const graph = getContext<Graph>('graph');

	export let isMovable: boolean;

	const activeGroup = graph.activeGroup;
	const groups = graph.groups;
	const initialNodePositions = graph.initialNodePositions;
	const cursor = graph.cursor;

	$: if ($activeGroup && $tracking) {
		moveNodes(graph);
	}

	function handleGroupClicked(event: CustomEvent) {
		$tracking = true;
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
