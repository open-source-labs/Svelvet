<script lang="ts">
	import Header from './Header.svelte';
	import Resizer from '../Resizer/Resizer.svelte';
	import type { Graph, Node, Theme } from '$lib/types';
	import type { GroupKey, Group } from '$lib/types';
	import { initialClickPosition, activeKeys } from '$lib/stores';
	import { calculateFitContentWidth, calculateRelativeCursor, captureGroup } from '$lib/utils';
	import { getContext, onDestroy, onMount, setContext } from 'svelte';
	import { get } from 'svelte/store';

	export let node: Node;

	let absolute = false;

	$: maxZIndex = graph.maxZIndex;
	$: header = node.header;
	$: widthStore = node.dimensions.width;
	$: heightStore = node.dimensions.height;
	$: x = node.position.x;
	$: y = node.position.y;
	$: id = node.id;
	$: editable = node.editable;
	$: resizable = node.resizable;

	$: zIndex = node.zIndex;

	const graph: Graph = getContext<Graph>('graph');
	const theme = getContext<Theme>('theme');
	setContext<Node>('node', node);

	let collapsed = false;
	let isResizing = { width: false, height: false };
	let minWidth = 200;
	let minHeight = 200;

	let DOMnode: HTMLElement;

	const { locked, nodes: nodeStore, groups } = graph;
	const { selected: selectedNodeGroup, hidden: hiddenNodesGroup } = $groups;

	const snapTo: number = getContext('snapTo');

	// Creates reactive variable for whether the node is selected
	// We use this as a class directive in the component
	$: selectedNodes = selectedNodeGroup.nodes;
	$: selected = $selectedNodes.has(node);
	$: hiddenNodes = hiddenNodesGroup.nodes;
	$: hidden = $hiddenNodes.has(node);

	// Dynamically import the component for the node
	onMount(() => {
		// Not every browser handles fit-content well, so this is a workaround
		// We assign fit-content, calculate those dimensions
		// And reassign the width store the max value of
		// The initial dom dimensions, the min dimenions calculated, or the initial store value
		// Spend more time looking into this and see if there is a more obvious fix
		// const nodeRect = DOMnode.getBoundingClientRect();
		// [minWidth, minHeight] = calculateFitContentWidth(DOMnode);
		// // $widthStore = Math.max(nodeRect.width, minWidth, $widthStore);
		// // $heightStore = Math.max(nodeRect.height, minHeight, $heightStore);
		// $x = nodeRect.x;
		// $y = nodeRect.y;
		absolute = true;
	});

	onDestroy(() => {
		// Remove the node from the selected nodes group
		// If it is selected
		if (selected) {
			$selectedNodes.delete(node);
			$selectedNodes = $selectedNodes;
		}
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

	const headerSize = 40;
	// Dynamic CSS styles based on store values
	$: nodeWidth = `${$widthStore}px`;
	$: nodeHeight = `${$heightStore}px`;
	$: nodeLeft = `${$x}px`;
	$: nodeTop = `${$y}px`;

	$: editing = graph.editing;
	$: activeGroup = graph.activeGroup;
	$: cursor = graph.cursor;
	$: moving = node.moving;

	$: initialNodePositions = graph.initialNodePositions;

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

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function handleNodeTouch(e: TouchEvent) {
		if (e.touches.length > 1) return;
		if ($zIndex !== $maxZIndex && $zIndex !== Infinity) $zIndex = ++$maxZIndex;
		if ($locked) return;
		//e.stopPropagation();
		e.preventDefault();
		const dimensions = graph.dimensions;
		const { scale, translation } = graph.transforms;
		const { x: translateX, y: translateY } = translation;
		const { top, left, width, height } = get(dimensions);
		const touchPoint = calculateRelativeCursor(
			e.touches[0],
			top,
			left,
			width,
			height,
			get(scale),
			get(translateX),
			get(translateY)
		);
		initialClickPosition.set(touchPoint);
		nodeSelectLogic();
	}

	function handleNodeClicked(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();

		dispatch('nodeClicked', { node, e });

		if ($zIndex !== $maxZIndex && $zIndex !== Infinity) $zIndex = ++$maxZIndex;
		if ($locked) return;

		const { button } = e;

		$initialClickPosition = $cursor;

		// Right click sets editing node
		if (button === 2 && $editable) {
			$editing = node;
		}
		nodeSelectLogic();
	}

	function nodeSelectLogic() {
		const { group } = node;

		const nodeGroup: GroupKey | null = get(group);

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
	}
</script>

<!-- svelte-ignore a11y-non-interactive-element -->
{#if !hidden}
	<div
		{id}
		class="node-wrapper allow-pointer-events"
		class:absolute
		style:top={nodeTop}
		style:left={nodeLeft}
		style:width={nodeWidth}
		style:height={nodeHeight}
		style:z-index={$zIndex}
		on:contextmenu|preventDefault|stopPropagation
		on:keydown={handleKeydown}
		bind:this={DOMnode}
	>
		{#if $header}
			<Header />
		{/if}
		{#if !collapsed}
			<!-- This is the actual "node"-->
			<slot {grabHandle} {selected} />
			{#if resizable}
				<Resizer width height {minWidth} {minHeight} />
			{/if}
		{/if}
	</div>
{/if}

<style>
	@import url('./Node.css');
</style>
