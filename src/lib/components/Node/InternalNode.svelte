<script context="module" lang="ts">
	import { initialClickPosition, tracking } from '$lib/stores';
	import { captureGroup, calculateFitContentWidth } from '$lib/utils';
	import { afterUpdate, getContext, onDestroy, onMount, setContext } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import { get, writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import type { Node, Graph } from '$lib/types';
	import type { GroupKey, Group } from '$lib/types';
	const tagsToIgnore = new Set(['INPUT', 'SELECT', 'BUTTON', 'TEXTAREA']);
</script>

<script lang="ts">
	// Context
	const mounted = getContext<Writable<number>>('mounted');
	const duplicate = getContext<Writable<boolean>>('duplicate');
	const graphDOMElement = getContext<Writable<HTMLElement>>('graphDOMElement');

	const dispatch = createEventDispatcher();

	// Props
	export let node: Node;
	export let isDefault: boolean;
	export let useDefaults: boolean;
	export let center: boolean;
	export let nodeStore: Graph['nodes'];
	export let locked: Graph['locked'];
	export let groups: Graph['groups'];
	export let maxZIndex: Graph['maxZIndex'];
	export let centerPoint: Graph['center'];
	export let cursor: Graph['cursor'];
	export let initialNodePositions: Graph['initialNodePositions'];
	export let activeGroup: Graph['activeGroup'];
	export let editing: Graph['editing'];

	// Local stores
	const anchorsMounted = writable(0);

	// External stores
	const id = node.id;
	const position = node.position;
	const widthStore = node.dimensions.width;
	const heightStore = node.dimensions.height;
	const selectionColor = node.selectionColor;
	const editable = node.editable;
	const nodeLock = node.locked;
	const zIndex = node.zIndex;
	const bgColor = node.bgColor;
	const borderRadius = node.borderRadius;
	const textColor = node.textColor;
	const group = node.group;
	const borderColor = node.borderColor;
	const borderWidth = node.borderWidth;
	const rotation = node.rotation;
	const { selected: selectedNodeGroup, hidden: hiddenNodesGroup } = $groups;
	const hiddenNodes = hiddenNodesGroup.nodes;
	const selectedNodes = selectedNodeGroup.nodes;

	// Reactive variables
	let collapsed = false;
	let minWidth = 200;
	let minHeight = 100;
	let DOMnode: HTMLElement;

	// Subscriptions
	$: actualPosition = $position;

	// Reactive declarations
	$: selected = $selectedNodes.has(node); // Used as class directive
	$: hidden = $hiddenNodes.has(node); // Used as class directive

	// If the node is selected and the duplicate key pair is pressed
	// Dispatch the duplicate event
	$: if (selected && $duplicate) {
		dispatch('duplicate', node);
	}

	setContext<Node>('node', node);
	setContext<Writable<number>>('anchorsMounted', anchorsMounted);

	// Lifecycle methods
	onMount(() => {
		// If the node dimensions got set in previous steps, we don't need to do anything
		if (!$widthStore && !$heightStore) {
			// This only runs when a width and height were not provided via props
			// Set the wrapper to fit-content and grab the width and height
			[minWidth, minHeight] = calculateFitContentWidth(DOMnode);

			// Update the node dimensions in the store
			$widthStore = minWidth;
			$heightStore = minHeight;
		}

		if (center) {
			const opticalCenter = {
				x: $centerPoint.x - $widthStore / 2,
				y: $centerPoint.y - $heightStore / 2
			};
			node.position.set(opticalCenter);
			tracking.set(true);
			tracking.set(false);
		}
		$mounted++;
	});

	onDestroy(() => {
		// Remove the node from the selected nodes group
		// If it is selected
		if (selected) {
			$selectedNodes.delete(node);
			$selectedNodes = $selectedNodes;
		}
		// Decrement the store value for mounted nodes
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

	// This doesn't really do anything at the moment
	function handleKeydown(e: KeyboardEvent) {
		// If node is focused, hitting enter will toggle the selected state
		if (e.key === 'Enter') {
			toggleSelected();
		} else if (e.key === 'Backspace') {
			$nodeStore.delete(node.id);
			$nodeStore = $nodeStore;
		}
	}

	// Initial handler for a touch event on a node
	function handleNodeTouch(e: TouchEvent) {
		$graphDOMElement.focus();
		e.stopPropagation();
		e.preventDefault();

		if (e.touches.length > 1) return; // If the user is using more than one finger, don't do anything
		if ($locked || $nodeLock) return; // If the node is locked, don't do anything

		// If the node is Node is not currently on top, bring it to the front
		// Unless the zIndex prop has been set to infinity
		if ($zIndex !== $maxZIndex && $zIndex !== Infinity) $zIndex = ++$maxZIndex;

		// Dispatch our nodeClicked event for developer use
		dispatch('nodeClicked', { node, e });

		// Capture the initial touch position
		$initialClickPosition = get(cursor);

		// Handle the node selection logic
		nodeSelectLogic(e);
	}

	// Initial handler for a click event on a node
	function handleNodeClicked(e: MouseEvent) {
		$graphDOMElement.focus();
		const targetElement = e.target as HTMLElement; // Cast e.target to HTMLElement

		// Bring node to front regardless of event target
		if ($zIndex !== $maxZIndex && $zIndex !== Infinity) $zIndex = ++$maxZIndex;

		// If the event target is an input, don't do anything
		if (tagsToIgnore.has(targetElement.tagName)) return;

		//Dispatch nodeClick event fo rdeveloper use
		dispatch('nodeClicked', { node, e });

		// Stop event from propagating to other mousedown listeners
		e.stopPropagation();

		// Prevent the default behavir of text selection on drag
		// May be safe to move this to the global mouse move listener
		e.preventDefault();

		// If the node or graph is locked, don't do anything
		if ($locked || $nodeLock) return;

		// Set our global tracking boolean to true
		$tracking = true;

		// Capture the initial click position
		$initialClickPosition = get(cursor);

		// Right click sets editing node
		if (e.button === 2 && $editable) {
			$editing = node;
		}
		// Handle selection logic
		nodeSelectLogic(e);
	}

	function nodeSelectLogic(e: MouseEvent | TouchEvent) {
		let groupData: Group;
		let parent;
		let isParent = false;

		// Check if the node is in a group
		const nodeGroup: GroupKey | null = $group;

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
		if (!e.shiftKey && selected) {
			$activeGroup = 'selected';
		} else {
			// If you click on a new node outside of the current group, clear the group
			if (!e.shiftKey && !selected && !e.shiftKey) {
				$selectedNodes.clear();
				$selectedNodes = $selectedNodes;
			}

			// Toggle the selected state of the node
			toggleSelected();
		}

		// Capture the initial positions of the nodes in the group
		$initialNodePositions = captureGroup($groups['selected'].nodes);
	}

	// Delete the node from the store
	function destroy() {
		nodeStore.delete(id);
	}

	const nodeConnectEvent = writable<null | MouseEvent>(null);
	setContext('nodeConnectEvent', nodeConnectEvent);
	function onMouseUp(e: MouseEvent) {
		const cursorPosition = get(cursor);
		const mouseDeltaX = cursorPosition.x - $initialClickPosition.x;
		const mouseDeltaY = cursorPosition.y - $initialClickPosition.y;
		const combinedDelta = Math.abs(mouseDeltaX) + Math.abs(mouseDeltaY);
		if (combinedDelta < 4) dispatch('nodeReleased', { e });

		$nodeConnectEvent = e;
	}

	// Custom action to handle Node interactions
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

	afterUpdate(() => {
		if (isDefault) return;
		const currentWidth = get(widthStore);
		const currentHeight = get(heightStore);

		const heightPreviouslyEqual = currentHeight === minHeight;
		const widthPreviouslyEqual = currentWidth === minWidth;

		// Capture the new min width and height of the node
		[minWidth, minHeight] = calculateFitContentWidth(DOMnode);

		if (widthPreviouslyEqual || currentWidth <= minWidth) {
			DOMnode.style.width = `${minWidth}px`;
			$widthStore = minWidth;
		} else {
			DOMnode.style.width = `${currentWidth}px`;
		}

		if (heightPreviouslyEqual || currentHeight <= minHeight) {
			DOMnode.style.height = `${minHeight}px`;
			$heightStore = minHeight;
		} else {
			DOMnode.style.height = `${currentHeight}px`;
		}
	});
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
		style:z-index={$zIndex}
		title="node"
		style:width="{$widthStore}px"
		style:height="{$heightStore}px"
		style:transform="rotate({$rotation}deg)"
		style:--prop-background-color={$bgColor || (isDefault || useDefaults ? null : 'transparent')}
		style:--prop-text-color={$textColor}
		style:--prop-border-color={$borderColor}
		style:--prop-selection-color={$selectionColor}
		style:--prop-border-radius={$borderRadius
			? `${$borderRadius}px`
			: isDefault || useDefaults
			? null
			: '0px'}
		style:--prop-border-width={$borderWidth || (isDefault || useDefaults ? null : '0px')}
		on:contextmenu|preventDefault|stopPropagation
		on:keydown|preventDefault|self={handleKeydown}
		on:mouseup={onMouseUp}
		use:grabHandle
		bind:this={DOMnode}
		tabIndex={0}
	>
		{#if !collapsed}
			<slot {grabHandle} {selected} {destroy} />

			<div id={`anchors-west-${node.id}`} class="anchors left" />
			<div id={`anchors-east-${node.id}`} class="anchors right" />
			<div id={`anchors-north-${node.id}`} class="anchors top" />
			<div id={`anchors-south-${node.id}`} class="anchors bottom" />
		{/if}
	</div>
{/if}

<style>
	.svelvet-node {
		position: absolute;
		pointer-events: all;
		display: flex;
		justify-content: center;
		align-items: center;
		will-change: top, left;
		cursor: var(--node-cursor, var(--default-node-cursor));
		--final-border-width: var(
			--prop-border-width,
			var(--node-border-width, var(--default-node-border-width))
		);
		--final-border-color: var(
			--prop-border-color,
			var(--node-border-color, var(--default-node-border-color))
		);
		--final-selection-color: var(
			--prop-selection-color,
			var(--node-selection-color, var(--default-node-selection-color))
		);

		border-radius: var(
			--prop-border-radius,
			var(--node-border-radius, var(--default-node-border-radius))
		);
		background-color: var(--prop-background-color, var(--node-color, var(--default-node-color)));
		color: var(--prop-text-color, var(--text-color, var(--default-text-color)));
		box-shadow: 0 0 0 var(--final-border-width) var(--final-border-color),
			var(--default-node-shadow);
	}
	.anchors {
		/* outline: solid 1px red; */
		display: flex;
		position: absolute;
		justify-content: center;
		align-items: center;
		z-index: 1;
		pointer-events: none;
	}
	.top,
	.bottom {
		width: 100%;
		justify-content: space-around;
	}

	.top {
		transform: translate(0px, -50%);
		top: 0px;
	}

	.bottom {
		transform: translate(0px, 50%);
		bottom: 0px;
	}

	.left,
	.right {
		height: 100%;
		flex-direction: column;
		justify-content: space-around;
	}

	.left {
		transform: translate(-50%);
		left: 0px;
	}

	.right {
		transform: translate(50%);
		right: 0px;
	}

	.locked {
		cursor: not-allowed;
	}
	.selected {
		box-shadow: 0 0 0 var(--final-border-width) var(--final-selection-color),
			var(--default-node-shadow);
	}
</style>
