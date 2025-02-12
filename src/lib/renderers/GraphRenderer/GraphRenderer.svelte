<script lang="ts">
	console.log("Componente GraphRenderer.svelte")
	import GroupBoxRenderer from '$lib/renderers/GroupBoxRenderer/GroupBoxRenderer.svelte';
	import ZoomPanWrapper from '$lib/containers/ZoomPanWrapper/ZoomPanWrapper.svelte';
	import { initialClickPosition, tracking } from '$lib/stores/CursorStore'; //these are like stores that track cursor position and whether an element is being dragged or moved
	import { captureGroup, moveNodes } from '$lib/utils/movers/';
	import { getContext } from 'svelte';
	import type { Graph } from '$lib/types'; //Graph type object

	const graph = getContext<Graph>('graph');
	const snapTo = getContext<number>('snapTo');

	export let isMovable: boolean;

	const activeGroup = graph.activeGroup;
	const groups = graph.groups;
	const initialNodePositions = graph.initialNodePositions;
	const cursor = graph.cursor;

	$: if ($activeGroup && $tracking) {
		moveNodes(graph, snapTo);
	}

	function handleGroupClicked(event: CustomEvent) {
		$tracking = true; //whether a node is being dragged or moved
		const { groupName } = event.detail;
		$activeGroup = groupName;
		$initialClickPosition = $cursor;
		$initialNodePositions = captureGroup($groups[groupName].nodes);
	}
</script>

<!--GroupBoxRenderer-This component renders the graphical representation of the groups in the graph. It listens for a groupClick event and, when triggered, invokes handleGroupClicked to initiate the logic for handling group selection and movement.
-->
<ZoomPanWrapper {isMovable}>
	<slot />
	<GroupBoxRenderer on:groupClick={handleGroupClicked} />
</ZoomPanWrapper>
