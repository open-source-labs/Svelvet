<script lang="ts">
	import Header from './Header.svelte';
	import Resizer from '../Resizer/Resizer.svelte';
	import type { Graph, Node, Theme } from '$lib/types';
	import type { GroupKey, Group } from '$lib/types';
	import { initialClickPosition, activeKeys } from '$lib/stores';
	import { calculateFitContentWidth, captureGroup } from '$lib/utils';
	import { getContext, onDestroy, onMount, setContext } from 'svelte';
	import { get } from 'svelte/store';

	export let node: Node;

	let absolute = false;

	$: maxZIndex = graph.maxZIndex;
	$: collapsible = node.collapsible;
	$: header = node.header;
	$: widthStore = node.dimensions.width;
	$: heightStore = node.dimensions.height;
	$: inputs = node.inputs;
	$: outputs = node.outputs;
	$: properties = node.properties;
	$: x = node.position.x;
	$: y = node.position.y;
	$: draggable = node.draggable;
	$: id = node.id;
	$: group = node.group;
	$: config = node.config;
	$: borderRadius = node.borderRadius;
	$: editable = node.editable;
	$: bgColor = node.bgColor;
	$: borderColor = node.borderColor;
	$: textColor = node.textColor;
	$: label = node.label;
	$: resizable = node.resizable;
	$: Component = node.component;
	$: hideable = node.hideable;
	$: headerColor = node.headerColor;
	$: anchors = node.anchors;

	let zIndex = 0;

	const graph: Graph = getContext<Graph>('graph');
	const theme = getContext<Theme>('theme');
	setContext<Node>('node', node);

	let isMovable = false;
	let collapsed = false;
	let isResizing = { width: false, height: false };
	let minWidth = 0;
	let minHeight = 0;

	let DOMnode: HTMLElement;

	const { isLocked, connectingFrom, transforms, bounds, nodes: nodeStore, groups } = graph;
	const { selected: selectedNodeGroup, hidden: hiddenNodesGroup } = $groups;

	const snapTo: number = getContext('snapTo');

	// Creates reactive variable for whether the node is selected
	// We use this as a class directive in the component
	$: selectedNodes = selectedNodeGroup.nodes;
	$: selected = $selectedNodes.has(node);
	$: hiddenNodes = hiddenNodesGroup.nodes;

	// Dynamically import the component for the node
	onMount(async () => {
		// Not every browser handles fit-content well, so this is a workaround
		// We assign fit-content, calculate those dimensions
		// And reassign the width store the max value of
		// The initial dom dimensions, the min dimenions calculated, or the initial store value
		// Spend more time looking into this and see if there is a more obvious fix
		const nodeRect = DOMnode.getBoundingClientRect();
		[minWidth, minHeight] = calculateFitContentWidth(DOMnode);
		$widthStore = Math.max(nodeRect.width, minWidth, $widthStore);
		$heightStore = Math.max(nodeRect.height, minHeight, $heightStore);
		$x = nodeRect.x;
		$y = nodeRect.y;
		absolute = true;
	});

	onDestroy(() => {
		// Remove the node from the selected nodes group
		// If it is selected
		if (selected) {
			$selectedNodes.delete(node);
			$selectedNodes = $selectedNodes;
		}
		graph.outputsRemoved.set(node.id);
	});

	function onMouseUp() {
		isResizing.width = false;
		isResizing.height = false;
	}

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

	$: initialNodePositions = graph.initialNodePositions;

	function grabHandle(node: HTMLElement) {
		node.addEventListener('mousedown', handleNodeClicked);

		return {
			destroy() {
				node.removeEventListener('mousedown', handleNodeClicked);
			}
		};
	}

	function handleNodeClicked(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();

		if (zIndex !== $maxZIndex) zIndex = ++$maxZIndex;
		if ($isLocked) return;

		const { button } = e;
		const { group } = node;

		const nodeGroup: GroupKey | null = get(group);

		let groupData: Group;
		let parent;
		let isParent = false;

		$initialClickPosition = $cursor;

		// Right click sets editing node
		if (button === 2 && editable) {
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
	}
</script>

<svelte:window on:mouseup|stopPropagation={onMouseUp} />

<!-- svelte-ignore a11y-non-interactive-element -->
<div
	{id}
	class="node-wrapper allow-pointer-events"
	class:absolute
	style:top={nodeTop}
	style:left={nodeLeft}
	style:width={nodeWidth}
	style:height={nodeHeight}
	style:z-index={zIndex}
	on:mouseup={onMouseUp}
	on:contextmenu|preventDefault|stopPropagation
	on:keydown={handleKeydown}
	bind:this={DOMnode}
>
	{#if $header}
		<Header />
	{/if}
	{#if !collapsed}
		{#if resizable}
			<Resizer width height both {minWidth} {minHeight} />
		{/if}
		<!-- This is the actual "node"-->
		<slot {grabHandle} {selected} />
	{/if}
</div>

<style>
	@import url('./Node.css');
</style>
