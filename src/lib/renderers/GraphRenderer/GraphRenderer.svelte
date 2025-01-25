<!-- @migration-task Error while migrating Svelte code: Unexpected token
https://svelte.dev/e/js_parse_error -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token
https://svelte.dev/e/js_parse_error -->
<script lang="ts">
	import GroupBoxRenderer from '$lib/renderers/GroupBoxRenderer/GroupBoxRenderer.svelte';
	import ZoomPanWrapper from '$lib/containers/ZoomPanWrapper/ZoomPanWrapper.svelte';
	import { initialClickPosition, tracking } from '$lib/stores/CursorStore';
	import { captureGroup, moveNodes } from '$lib/utils/movers/';
	import { getContext } from 'svelte';
	import type { Graph } from '$lib/types';

	const graph = getContext<Graph>('graph');
	const snapTo = getContext<number>('snapTo');

	$props = {
		isMovable: false
	};

	const activeGroup = graph.activeGroup;
	const groups = graph.groups;
	const initialNodePositions = graph.initialNodePositions;
	const cursor = graph.cursor;

	$derived activeGroup = graph.activeGroup;
	$derived tracking = tracking;
	$derived cursor = cursor;
	$derived initialNodePositions = initialNodePositions;
	$derived groups = groups;

	$effect(() => {
		if ($activeGroup && $tracking) {
			moveNodes(graph, snapTo);
		}
	});

	function handleGroupClicked(event: CustomEvent) {
		$tracking = true;
		const { groupName } = event.detail;
		$activeGroup = groupName;
		$initialClickPosition = $cursor;
		$initialNodePositions = captureGroup($groups[groupName].nodes);
	}
</script>

<ZoomPanWrapper {...$props}>
	<slot />
	<GroupBoxRenderer ongroupclick={handleGroupClicked} />
</ZoomPanWrapper>
