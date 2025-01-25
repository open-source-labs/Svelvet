<!-- @migration-task Error while migrating Svelte code: Identifier 'anchorsMounted' has already been declared
https://svelte.dev/e/js_parse_error -->
<!-- @migration-task Error while migrating Svelte code: Identifier 'anchorsMounted' has already been declared
https://svelte.dev/e/js_parse_error -->
<script context="module" lang="ts">
	import { initialClickPosition, tracking } from '$lib/stores';
	import { captureGroup } from '$lib/utils';
	import { getContext, onDestroy, onMount, setContext } from 'svelte';
	import { get, writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import type { Node, Graph } from '$lib/types';
	import type { GroupKey, Group } from '$lib/types';
	const tagsToIgnore = new Set(['INPUT', 'SELECT', 'BUTTON', 'TEXTAREA']);
</script>

<script lang="ts">
	const nodeDynamic = getContext<boolean>('dynamic');
	const node = getContext<Node>('node');
	const graphDirection = getContext<string>('direction');
	const mounted = getContext<Writable<number | true>>('mounted');
	const nodeStore = getContext<Graph['nodes']>('nodeStore');
	const nodeConnectEvent = getContext<Writable<null | MouseEvent>>('nodeConnectEvent');
	const anchorsMounted = getContext<Writable<number>>('anchorsMounted');
	const flowChart = getContext<object>('flowchart') || undefined;

	$props = {
		node: null,
		isDefault: false,
		useDefaults: false,
		center: false,
		nodeStore: null,
		locked: null,
		groups: null,
		maxZIndex: null,
		centerPoint: null,
		cursor: null,
		initialNodePositions: null,
		activeGroup: null,
		editing: null,
		dimensionsProvided: false,
		title: ''
	};

	const dispatch = (eventName, detail) => {
		const event = new CustomEvent(eventName, { detail });
		dispatchEvent(event);
	};

	const duplicate = writable(false);
	const graphDOMElement = writable<HTMLElement | null>(null);

	const anchorsMounted = writable(0);
	const nodeConnectEvent = writable<null | MouseEvent>(null);

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

	$state = {
		actualPosition: $position,
		selected: $selectedNodes.has(node),
		hidden: $hiddenNodes.has(node),
		fixedSizing: dimensionsProvided || $resized
	};

	$effect(() => {
		if ($state.selected && $duplicate) {
			dispatch('duplicate', node);
		}
	});

	setContext<Node>('node', node);
	setContext<Writable<number>>('anchorsMounted', anchorsMounted);
	setContext<Writable<boolean>>('resized', resized);
	setContext('nodeConnectEvent', nodeConnectEvent);

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
		mounted.update((n) => n + 1);
	});

	onDestroy(() => {
		if ($state.selected) {
			$selectedNodes.delete(node);
			$selectedNodes = $selectedNodes;
		}
		mounted.update((n) => n - 1);
	});

	function toggleSelected() {
		if ($state.selected) {
			if (node) $selectedNodes.delete(node);
			$selectedNodes = $selectedNodes;
		} else {
			if (node) $selectedNodes.add(node);
			$selectedNodes = $selectedNodes;
		}
	}

	function handleNodeClicked(e: MouseEvent | TouchEvent) {
		$initialClickPosition = get(cursor);

		$graphDOMElement.focus();

		if ($zIndex !== $maxZIndex && $zIndex !== Infinity) $zIndex = ++$maxZIndex;

		const targetElement = e.target as HTMLElement;
		if (tagsToIgnore.has(targetElement.tagName)) return;

		e.preventDefault();

		dispatch('nodeClicked', { node, e });

		if ($locked || $nodeLock) return;

		if ('touches' in e) {
			if (e.touches && e.touches.length > 1) return;
		} else {
			if (e.button === 2 && $editable) {
				$editing = node;
			}
		}
		$tracking = true;

		nodeSelectLogic(e);
	}

	function nodeSelectLogic(e: MouseEvent | TouchEvent) {
		let groupData: Group;
		let parent;
		let isParent = false;

		const nodeGroup: GroupKey | null = $group;

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

		if (!e.shiftKey && $state.selected) {
			$activeGroup = 'selected';
		} else {
			if (!e.shiftKey && !$state.selected && !e.shiftKey) {
				$selectedNodes.clear();
				$selectedNodes = $selectedNodes;
			}

			toggleSelected();
		}

		$initialNodePositions = captureGroup($groups['selected'].nodes);
	}

	function destroy() {
		nodeStore.delete(id);
	}

	function onMouseUp(e: MouseEvent) {
		const cursorPosition = get(cursor);
		const mouseDeltaX = cursorPosition.x - $initialClickPosition.x;
		const mouseDeltaY = cursorPosition.y - $initialClickPosition.y;
		const combinedDelta = Math.abs(mouseDeltaX) + Math.abs(mouseDeltaY);
		if (combinedDelta < 4) dispatch('nodeReleased', { e, node });

		$nodeConnectEvent = e;
	}

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

	// Handle edge cases for node selection and movement
	$effect(() => {
		if ($position.x < 0) {
			$position.x = 0;
		}
		if ($position.y < 0) {
			$position.y = 0;
		}
		if ($position.x > window.innerWidth - $widthStore) {
			$position.x = window.innerWidth - $widthStore;
		}
		if ($position.y > window.innerHeight - $heightStore) {
			$position.y = window.innerHeight - $heightStore;
		}
	});
</script>

{#if !$state.hidden}
	<div
		{id}
		class="svelvet-node"
		role="button"
		class:selected={$state.selected}
		class:locked={$locked || $nodeLock}
		style:top="{actualPosition.y}px"
		style:left="{actualPosition.x}px"
		style:z-index={$zIndex}
		{title}
		style:width={$state.fixedSizing ? $widthStore + 'px' : 'fit-content'}
		style:height={$state.fixedSizing ? $heightStore + 'px' : 'fit-content'}
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
		oncontextmenu={e => { e.preventDefault(); e.stopPropagation(); }}
		onmouseup={onMouseUp}
		onmousedown={handleNodeClicked}
		ontouchstart={handleNodeClicked}
		tabindex={0}
	>
		{#if !$state.fixedSizing}
			<div
				style:width="fit-content"
				style:height="fit-content"
				bind:clientHeight={$heightStore}
				bind:clientWidth={$widthStore}
			>
					{@render name="default"}
					<slot {grabHandle} {selected} {destroy} />
				{@/render}
			</div>
		{:else}
				{@render name="default"}
				<slot {grabHandle} {selected} {destroy} />
			{@/render}
		{/if}

		<div id={`anchors-west-${node.id}`} class="anchors left">
			{@render name="anchorWest"}
			<slot name="anchorWest" />
		{@/render}
		</div>
		<div id={`anchors-east-${node.id}`} class="anchors right">
			{@render name="anchorEast"}
			<slot name="anchorEast" />
		{@/render}
		</div>
		<div id={`anchors-north-${node.id}`} class="anchors top">
			{@render name="anchorNorth"}
			<slot name="anchorNorth" />
		{@/render}
		</div>
		<div id={`anchors-south-${node.id}`} class="anchors bottom">
			{@render name="anchorSouth"}
			<slot name="anchorSouth" />
		{@/render}
		</div>
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
		font-family: 'Roboto', sans-serif;
	}
	.anchors {
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
		cursor: var(--node-cursor-blocked, var(--default-node-cursor-blocked));
	}
	.selected {
		box-shadow: 0 0 0 var(--final-border-width) var(--final-selection-color),
			var(--default-node-shadow);
	}
</style>
