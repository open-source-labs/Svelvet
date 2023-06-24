<script context="module" lang="ts">
	import { initialClickPosition, tracking } from '$lib/stores';
	import { captureGroup } from '$lib/utils';
	import { getContext, onDestroy, onMount, setContext } from 'svelte';
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
	export let dimensionsProvided = false;
	export let title: string;

	// Local stores
	const anchorsMounted = writable(0);
	const nodeConnectEvent = writable<null | MouseEvent>(null);

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
	const resized = writable(false);

	// Reactive variables
	// let collapsed = false; //not being used

	// Subscriptions
	$: actualPosition = $position;

	// Reactive declarations
	$: selected = $selectedNodes.has(node); // Used as class directive
	$: hidden = $hiddenNodes.has(node); // Used as class directive
	$: fixedSizing = dimensionsProvided || $resized;

	// If the node is selected and the duplicate key pair is pressed
	// Dispatch the duplicate event
	$: if (selected && $duplicate) {
		dispatch('duplicate', node);
	}

	setContext<Node>('node', node);
	setContext<Writable<number>>('anchorsMounted', anchorsMounted);
	// setContext<Writable<HTMLElement | null>>('DOMnode', DOMnode);
	setContext<Writable<boolean>>('resized', resized);
	setContext('nodeConnectEvent', nodeConnectEvent);

	// Lifecycle methods
	onMount(() => {
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
	// function handleKeydown(e: KeyboardEvent) {
	// 	// If node is focused, hitting enter will toggle the selected state
	// 	if (e.key === 'Enter') {
	// 		toggleSelected();
	// 	} else if (e.key === 'Backspace') {
	// 		$nodeStore.delete(node.id);
	// 		$nodeStore = $nodeStore;
	// 	}
	// }

	// Initial handler for a click event on a node
	function handleNodeClicked(e: MouseEvent | TouchEvent) {
		// Capture the initial click position
		$initialClickPosition = get(cursor);

		$graphDOMElement.focus();

		// If the node is Node is not currently on top, bring it to the front
		// Unless the zIndex prop has ben set to infinity
		if ($zIndex !== $maxZIndex && $zIndex !== Infinity) $zIndex = ++$maxZIndex;

		const targetElement = e.target as HTMLElement; // Cast e.target to HTMLElement

		if (tagsToIgnore.has(targetElement.tagName)) return;

		e.preventDefault();

		// Dispatch our nodeClicked event for developer use
		dispatch('nodeClicked', { node, e });

		// If the node or graph is locked, don't do anything
		if ($locked || $nodeLock) return; // If the node is locked, don't do anything

		if ('touches' in e) {
			// TypeScript now knows that e is a TouchEvent
			if (e.touches && e.touches.length > 1) return;
		} else {
			// TypeScript now knows that e is a MouseEvent
			if (e.button === 2 && $editable) {
				$editing = node;
			}
		}
		// Set our global tracking boolean to true
		$tracking = true;

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

	function onMouseUp(e: MouseEvent) {
		const cursorPosition = get(cursor);
		node.moved.set({
			x: cursorPosition.x - $initialClickPosition.x,
			y: cursorPosition.y - $initialClickPosition.y
		});
		dispatch('nodeReleased', { e, node });

		$nodeConnectEvent = e;
	}

	// Custom action to handle Node interactions
	function grabHandle(node: HTMLElement) {
		node.addEventListener('mousedown', handleNodeClicked);
		node.addEventListener('touchstart', handleNodeClicked);
		return {
			destroy() {
				node.removeEventListener('mousedown', handleNodeClicked);
				node.removeEventListener('touchstart', handleNodeClicked);
			}
		};
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
		style:z-index={$zIndex}
		{title}
		style:width={fixedSizing ? $widthStore + 'px' : 'fit-content'}
		style:height={fixedSizing ? $heightStore + 'px' : 'fit-content'}
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
		on:mouseup={onMouseUp}
		use:grabHandle
		tabIndex={0}
	>
		{#if !fixedSizing}
			<div
				style:width="fit-content"
				style:height="fit-content"
				bind:clientHeight={$heightStore}
				bind:clientWidth={$widthStore}
			>
				<slot {grabHandle} {selected} {destroy} />
			</div>
		{:else}
			<slot {grabHandle} {selected} {destroy} />
		{/if}

		<div id={`anchors-west-${node.id}`} class="anchors left" />
		<div id={`anchors-east-${node.id}`} class="anchors right" />
		<div id={`anchors-north-${node.id}`} class="anchors top" />
		<div id={`anchors-south-${node.id}`} class="anchors bottom" />
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
