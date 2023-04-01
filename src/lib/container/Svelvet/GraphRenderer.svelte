<script lang="ts">
	import type { Graph } from '$lib/types';
	import GraphRenderer from '../GraphRenderer/GraphRenderer.svelte';
	import ZoomPanWrapper from '../ZoomPanWrapper/ZoomPanWrapper.svelte';
	import { updateTranslation } from './updateTranslation';
	import { initialClickPosition } from '$lib/stores/CursorStore';
	import { activeKeys } from '$lib/stores';
	import { captureGroup, moveNodes } from '$lib/components/Node/moveNodes';
	import { get } from 'svelte/store';

	export let graph: Graph;
	export let theme: string;
	export let isMovable: boolean;
	const { transforms, id, connectingFrom, cursor } = graph;
	$: isLocked = graph.isLocked;
	$: activeGroup = graph.activeGroup;
	$: groups = graph.groups;
	$: selectedNodes = $groups.selected;
	$: initialNodePositions = graph.initialNodePositions;

	const { x, y } = transforms.translation;

	$: if (isMovable) {
		[$x, $y] = updateTranslation($initialClickPosition, $cursor, transforms);
	}

	$: if ($activeGroup) {
		console.log('GROUP', $activeGroup, Math.random());
		$cursor;
		moveNodes(graph, $initialClickPosition, $initialNodePositions, $activeGroup);
	}

	function handleGroupClicked(event: CustomEvent) {
		const { groupName } = event.detail;
		console.log({ groupName });
		$activeGroup = groupName;
		$initialClickPosition = $cursor;
		$initialNodePositions = captureGroup($groups[groupName]);
		console.log('WAHT', $initialNodePositions[0]);
	}

	function handleNodeClicked(event: CustomEvent) {
		if ($isLocked) return;
		const { node, selected } = event.detail;
		const { group } = node;
		console.log('Setting initial click position');
		$initialClickPosition = $cursor;
		$activeGroup = 'selected';

		// If you click on a node that is already selected
		if (!$activeKeys['Shift'] && selected) {
			$activeGroup = 'selected';
		} else {
			// If you click on a new node outside of the current group, clear the group
			if (!$activeKeys['Shift'] && !selected && !$activeKeys['Meta']) {
				Array.from($selectedNodes).forEach((node) => {
					const { group } = node;
					group.set(null);
				});
				$selectedNodes.clear();
				$selectedNodes = $selectedNodes;
			}

			// Toggle the selected state of the node
			toggleSelected();
		}

		// Capture the initial positions of the nodes in the group
		$initialNodePositions = captureGroup($groups['selected']);

		function toggleSelected() {
			if (selected) {
				group.set(null);
				if (node) $selectedNodes.delete(node);
				$selectedNodes = $selectedNodes;
			} else {
				group.set('selected');
				if (node) $selectedNodes.add(node);
				$selectedNodes = $selectedNodes;
			}
		}
	}
</script>

<ZoomPanWrapper {transforms} {id}>
	<GraphRenderer
		on:nodeClicked={handleNodeClicked}
		on:groupClick={handleGroupClicked}
		--node-background="var(--node-background-{theme})"
		--text-color="var(--text-color-{theme})"
		nodes={graph.nodes}
		edges={graph.edges}
		connectingFrom={graph.connectingFrom}
		{graph}
	/>
</ZoomPanWrapper>
