<script lang="ts">
	import type { Graph, Group, GroupBox } from '$lib/types';
	import ZoomPanWrapper from '../ZoomPanWrapper/ZoomPanWrapper.svelte';
	import { updateTranslation } from '$lib/utils';
	import { initialClickPosition } from '$lib/stores/CursorStore';
	import { activeKeys } from '$lib/stores';
	import { captureGroup, moveNodes } from '$lib/utils';
	import { get } from 'svelte/store';
	import { getContext } from 'svelte';
	import NodeRenderer from '../NodeRenderer/NodeRenderer.svelte';
	import GroupBoxRenderer from '../GroupBoxRenderer/GroupBoxRenderer.svelte';
	import EdgeRenderer from '../EdgeRenderer/EdgeRenderer.svelte';

	const graph = getContext<Graph>('graph');
	export let theme: string;
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
		$cursor; // This necessary to trigger the update
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
	<NodeRenderer />
	<EdgeRenderer />
	<GroupBoxRenderer on:groupClick={handleGroupClicked} />
</ZoomPanWrapper>
