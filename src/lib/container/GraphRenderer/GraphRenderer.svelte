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

	$: isLocked = graph.isLocked;
	$: activeGroup = graph.activeGroup;
	$: groups = graph.groups;
	$: selectedGroup = $groups.selected;
	$: selectedNodes = selectedGroup.nodes;
	$: selectedParent = selectedGroup.parent;
	$: initialNodePositions = graph.initialNodePositions;
	$: groupBoxes = graph.groupBoxes;
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

	function handleNodeClicked(event: CustomEvent) {
		console.log(event);
		if ($isLocked) return;
		const { node, selected } = event.detail;
		const { group } = node;
		$initialClickPosition = $cursor;
		const nodeGroup: string = get(group);
		let groupData: Group;
		let parent;
		let isParent = false;

		if (nodeGroup) {
			groupData = $groups[nodeGroup];
			parent = get(groupData.parent);
			isParent = parent === node;
		}

		if (isParent) {
			$activeGroup = nodeGroup;
		} else {
			$activeGroup = 'selected';
		}

		// If you click on a node that is already selected
		if (!$activeKeys['Shift'] && selected) {
			$activeGroup = 'selected';
		} else {
			// If you click on a new node outside of the current group, clear the group
			if (!$activeKeys['Shift'] && !selected && !$activeKeys['Meta']) {
				$selectedNodes.clear();
				$selectedNodes = $selectedNodes;
			}

			// Toggle the selected state of the node
			toggleSelected();
		}

		// Capture the initial positions of the nodes in the group
		$initialNodePositions = captureGroup($groups['selected'].nodes);

		function toggleSelected() {
			if (selected) {
				if (node) $selectedNodes.delete(node);
				$selectedNodes = $selectedNodes;
			} else {
				if (node) $selectedNodes.add(node);
				$selectedNodes = $selectedNodes;
			}
		}
	}
</script>

<ZoomPanWrapper>
	<NodeRenderer on:nodeClicked={handleNodeClicked} />
	<EdgeRenderer />
	<GroupBoxRenderer on:groupClick={handleGroupClicked} />
</ZoomPanWrapper>
