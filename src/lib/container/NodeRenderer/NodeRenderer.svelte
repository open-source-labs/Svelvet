<script lang="ts">
	import Node from '$lib/components/Node/Node.svelte';
	import type { Graph, Group } from '$lib/types';
	import { getContext } from 'svelte';
	import { get } from 'svelte/store';
	import { initialClickPosition } from '$lib/stores/CursorStore';
	import { activeKeys } from '$lib/stores';
	import { captureGroup } from '$lib/utils';

	const graph = getContext<Graph>('graph');

	$: groups = graph.groups;
	$: hidden = $groups.hidden.nodes;
	$: nodes = graph.nodes;
	$: isLocked = graph.isLocked;
	$: cursor = graph.cursor;
	$: activeGroup = graph.activeGroup;
	$: selectedNodes = $groups.selected.nodes;
	$: initialNodePositions = graph.initialNodePositions;
	$: editing = graph.editing;

	function handleNodeClicked(event: CustomEvent) {
		if ($isLocked) return;
		const { node, selected, button } = event.detail;
		const { group } = node;
		$initialClickPosition = $cursor;
		const nodeGroup: string = get(group);
		let groupData: Group;
		let parent;
		let isParent = false;

		if (button === 2) {
			$editing = node;
		}

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

{#each Object.entries($nodes) as [id, node] (id)}
	{#if !$hidden.has(node)}
		<Node on:nodeClicked={handleNodeClicked} {node} />
	{/if}
{/each}
