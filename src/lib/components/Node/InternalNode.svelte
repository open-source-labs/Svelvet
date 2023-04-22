<script lang="ts">
	import type { Graph, Node, ThemeGroup } from '$lib/types';
	import type { GroupKey, Group } from '$lib/types';
	import { initialClickPosition, activeKeys, tracking } from '$lib/stores';
	import { captureGroup, calculateFitContentWidth, calculateFitView } from '$lib/utils';
	import { getContext, onDestroy, onMount, setContext } from 'svelte';
	import { get } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import type { Writable } from 'svelte/store';
	import * as s from '$lib/constants/styles';

	export let node: Node;
	export let isDefault: boolean;

	const position = node.position;
	const widthStore = node.dimensions.width;
	const heightStore = node.dimensions.height;

	$: actualPosition = $position;
	$: maxZIndex = graph.maxZIndex;
	$: id = node.id;
	$: editable = node.editable;
	$: nodeLock = node.locked;
	$: zIndex = node.zIndex;
	$: bgColor = node.bgColor;
	$: borderRadius = node.borderRadius;
	$: textColor = node.textColor;
	$: borderColor = node.borderColor;
	$: selectionColor = node.selectionColor;
	$: borderWidth = node.borderWidth;
	$: rotation = node.rotation;

	const graph: Graph = getContext<Graph>('graph');
	const themeStore = getContext<Writable<ThemeGroup>>('themeStore');
	const mounted = getContext<Writable<number>>('mounted');

	setContext<Node>('node', node);

	let collapsed = false;
	let minWidth = 200;
	let minHeight = 100;

	let DOMnode: HTMLElement;

	const { locked, nodes: nodeStore, groups } = graph;
	const { selected: selectedNodeGroup, hidden: hiddenNodesGroup } = $groups;
	const dispatch = createEventDispatcher();

	// Creates reactive variable for whether the node is selected
	// We use this as a class directive in the component
	$: selectedNodes = selectedNodeGroup.nodes;
	$: selected = $selectedNodes.has(node);
	$: hiddenNodes = hiddenNodesGroup.nodes;
	$: hidden = $hiddenNodes.has(node);

	$: editing = graph.editing;
	$: activeGroup = graph.activeGroup;
	$: cursor = graph.cursor;
	$: initialNodePositions = graph.initialNodePositions;

	onMount(() => {
		// If the node dimensions got set in previous steps, we don't need to do anything
		if ($widthStore && $heightStore) return;

		// This only runs when a width and height were not provided via props
		// Set the wrapper to fit-content and grab the width and height
		[minWidth, minHeight] = calculateFitContentWidth(DOMnode);

		// Update the node dimensions in the store
		$widthStore = minWidth;
		$heightStore = minHeight;
		$mounted++;
	});

	onDestroy(() => {
		// Remove the node from the selected nodes group
		// If it is selected
		if (selected) {
			$selectedNodes.delete(node);
			$selectedNodes = $selectedNodes;
		}
		$mounted--;
	});

	function toggleSelected() {
		if (selected) {
			if (node) $selectedNodes.delete(node);
			$selectedNodes = $selectedNodes;
		} else {
			if (node) $selectedNodes.add(node);
			$selectedNodes = $selectedNodes;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		// If node is focused, hitting enter will toggle the selected state
		if (e.key === 'Enter') {
			toggleSelected();
		} else if (e.key === 'Backspace') {
			delete $nodeStore[id];
			$nodeStore = $nodeStore;
		}
	}

	function grabHandle(node: HTMLElement) {
		node.addEventListener('mousedown', handleNodeClicked);
		node.addEventListener('touchstart', handleNodeTouch);
		return {
			destroy() {
				node.removeEventListener('mousedown', handleNodeClicked);
				node.removeEventListener('touchstart', handleNodeTouch);
			}
		};
	}

	function handleNodeTouch(e: TouchEvent) {
		e.stopPropagation();
		e.preventDefault();
		if (e.touches.length > 1) return;
		if ($locked || $nodeLock) return;
		if ($zIndex !== $maxZIndex && $zIndex !== Infinity) $zIndex = ++$maxZIndex;
		dispatch('nodeClicked', { node, e });

		$initialClickPosition = $cursor;
		nodeSelectLogic();
	}

	function handleNodeClicked(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();

		if ($locked || $nodeLock) return;
		if ($zIndex !== $maxZIndex && $zIndex !== Infinity) $zIndex = ++$maxZIndex;
		dispatch('nodeClicked', { node, e });
		$tracking = true;
		const { button } = e;

		$initialClickPosition = $cursor;

		// Right click sets editing node
		if (button === 2 && $editable) {
			$editing = node;
		}
		nodeSelectLogic();
	}

	function nodeSelectLogic() {
		let groupData: Group;
		let parent;
		let isParent = false;

		// Check if the node is in a group
		const nodeGroup: GroupKey | null = get(node.group);

		// If it is in a group, check if it's the parent
		if (nodeGroup) {
			groupData = $groups[nodeGroup];
			parent = get(groupData.parent);
			isParent = parent === node;
		}
		// If it is the parent, set the active group to the group
		// If it isn't the parent, set the active group to "selected"
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
	}

	function destroy() {
		nodeStore.delete(id);
	}
</script>

<!-- svelte-ignore a11y-non-interactive-element -->
{#if !hidden}
	<div
		{id}
		class="svelvet-node"
		class:selected
		class:locked={$locked || $nodeLock}
		style:top="{actualPosition.y}px"
		style:left="{actualPosition.x}px"
		style:width="{$widthStore}px"
		style:height="{$heightStore}px"
		style:z-index={$zIndex}
		style:background-color={$bgColor || (isDefault ? $themeStore.node : 'transparent')}
		style:border-radius="{$borderRadius || (isDefault && s.NODE_BORDER_RADIUS)}px"
		style:color={$textColor || $themeStore.text}
		style:--border-color={$borderColor || $themeStore.border}
		style:--border-width="{$borderWidth || (isDefault && s.NODE_BORDER_WIDTH)}px"
		style:--selection-color={$selectionColor || $themeStore.selection}
		style:transform="rotate({$rotation}deg)"
		on:contextmenu|preventDefault|stopPropagation
		on:keydown={handleKeydown}
		bind:this={DOMnode}
		use:grabHandle
		tabIndex={0}
	>
		{#if !collapsed}
			<slot {grabHandle} {selected} {destroy} />
		{/if}
	</div>
{/if}

<style>
	.svelvet-node {
		cursor: grab;
		position: absolute;
		pointer-events: all;
		display: flex;
		justify-content: center;
		align-items: center;
		will-change: top, left;
		box-shadow: 0 0 0 var(--border-width) var(--border-color), var(--shadow-elevation-medium);
	}

	.locked {
		cursor: not-allowed;
	}
	.selected {
		box-shadow: 0 0 0 var(--border-width) var(--selection-color);
	}
</style>
