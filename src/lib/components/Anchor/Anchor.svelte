<script lang="ts">
	import type {
		Graph,
		Node,
		Anchor,
		Direction,
		AnchorKey,
		InputType,
		NodeKey,
		OutputStore,
		InputStore,
		Theme
	} from '$lib/types';
	import { onMount, getContext, onDestroy } from 'svelte';
	import { ANCHOR_SIZE, ANCHOR_RADIUS } from '$lib/constants';
	import { writable } from 'svelte/store';
	import { createEdge, createAnchor, generateOutput } from '$lib/utils/creators';
	import { calculateRelativeCursor } from '$lib/utils/calculators';
	import { get } from 'svelte/store';
	import { activeKeys } from '$lib/stores';
	import { sortEdgeKey } from '$lib/utils/helpers/sortKey';
	import { createEventDispatcher } from 'svelte';
	import { THEMES } from '$lib/constants/themes';
	const dispatch = createEventDispatcher();

	const node = getContext<Node>('node');
	const graph = getContext<Graph>('graph');
	const graphDirection = getContext<string>('direction');
	const theme = getContext<Theme>('theme');

	export let bgColor = THEMES[theme].anchor;

	export let key: string | number | null = null;
	export let id: string | number = 0;
	export let input: boolean = false;
	export let output: boolean = false;
	export let inputsStore: InputStore | null = null;
	export let outputStore: OutputStore | null = null;
	export let multiple = output ? true : input ? false : true;
	export let direction: Direction =
		graphDirection === 'TD' ? (input ? 'north' : 'south') : input ? 'west' : 'east';

	export let dynamic = false;
	export let edge: ConstructorOfATypedSvelteComponent | null = null;
	export let connections: [string, string][] = [];

	let animationFrameId: number;
	let anchorElement: HTMLDivElement;
	let anchorWidth: number;
	let anchorHeight: number;
	let anchor: Anchor;
	let tracking = false;
	let hovering = false;
	let previousConnectionCount = 0;
	let type: InputType = input === output ? null : input ? 'input' : 'output';

	$: anchors = node.anchors;
	$: edges = graph.edges;
	$: scale = graph.transforms.scale;
	$: resizingWidth = node.resizingWidth;
	$: resizingHeight = node.resizingHeight;
	$: connecting =
		input === output
			? $linkingAny === anchor
			: input
			? $linkingInput?.anchor === anchor
			: $linkingOutput?.anchor === anchor;
	$: connectedAnchors = anchor?.connected;
	$: connected = $connectedAnchors?.size > 0 || false;
	$: linkingInput = graph.linkingInput;
	$: linkingOutput = graph.linkingOutput;
	$: linkingAny = graph.linkingAny;
	$: isWaitingForConnection = connections.length > 0;

	// On mount, we query the dom to capture the position of the anchor
	// We then create the anchor object and add it to the store
	onMount(async () => {
		const { top, left, width, height } = anchorElement.getBoundingClientRect();
		const key: AnchorKey = `A-${id || anchors.count() + 1}/${node.id}`;

		const anchorPosition = { y: top, x: left };
		anchor = createAnchor(
			node,
			key,
			anchorPosition,
			{ width, height },
			inputsStore || outputStore || null,
			edge,
			type,
			direction,
			dynamic
		);

		anchors.add(anchor, anchor.id);

		checkConnections();
	});

	// When the anchor is destroyed we remove the edge and cancel any animation
	onDestroy(() => {
		destroy();
		cancelAnimationFrame(animationFrameId);
	});

	// If the user has specifcied connections, we check if the anchor pair is in memory yet
	$: if (isWaitingForConnection) {
		$anchors;
		checkConnections();
	}

	// If an anchor is added to the store, we update all anchor positions
	$: if (anchorElement) {
		$anchors;
		updatePosition();
	}

	$: if (!$activeKeys['Shift']) clearAllLinking();

	// If the parent node is resizing, we actively track the position of the anchor
	$: if (!tracking && ($resizingWidth || $resizingHeight)) {
		tracking = true;
		trackPosition();
	} else if (!$resizingWidth && !$resizingHeight && tracking) {
		tracking = false;
		cancelAnimationFrame(animationFrameId);
	}

	$: anchorDimensions = {
		width: anchorWidth / $scale,
		height: anchorHeight / $scale
	};

	// This fires the connection/disconnection events
	// We track previous connections and fire a correct event accordingly
	$: {
		$connectedAnchors; // This just forces the code block to run every time it changes

		if ($connectedAnchors?.size < previousConnectionCount) {
			dispatch('disconnection', { node, anchor });
		} else if ($connectedAnchors?.size > previousConnectionCount) {
			dispatch('connection', { node, anchor });
		}
		previousConnectionCount = $connectedAnchors?.size;
	}

	function handleClick() {
		updatePosition(); // Just in case the anchor has moved

		if (connected && !multiple && !$linkingInput && !$linkingOutput && !$linkingAny)
			return disconnect();

		if (!$linkingInput && !$linkingOutput && !$linkingAny) return startEdge();

		if (input === output) {
			connectEdge();
		} else if (input) {
			if ($linkingInput) return;
			if ($linkingOutput || $linkingAny) connectEdge();
		} else if (output) {
			if ($linkingOutput) return;
			if ($linkingInput || $linkingAny) connectEdge();
		}

		clearAllLinking();
	}

	function startEdge() {
		if (input === output) {
			$linkingAny = anchor;
			createCursorEdge(anchor, null);
		} else if (input) {
			$linkingInput = {
				anchor,
				store: inputsStore,
				key
			};
			createCursorEdge(null, anchor);
		} else if (output) {
			$linkingOutput = {
				anchor,
				store: outputStore
			};
			createCursorEdge(anchor, null);
		}
	}

	function createCursorEdge(source: Anchor | null, target: Anchor | null) {
		// Create a temporary edge to track the cursor
		const newEdge = createEdge({ source, target }, source?.edge || null);
		// Add the edge to the store
		edges.add(newEdge, 'cursor');
	}

	function connectEdge() {
		// Delete the temporary edge
		edges.delete('cursor');

		// If the anchor is already connected and multiple connections are not allowed
		// We don't want to create a new edge
		if (connected && !multiple) return;
		if (
			$linkingAny === anchor ||
			$linkingOutput?.anchor === anchor ||
			$linkingInput?.anchor === anchor
		)
			return;

		updatePosition();

		// Create edge
		let source: Anchor | null = null;
		let target: Anchor | null = null;

		if (input === output) {
			if ($linkingAny) {
				source = $linkingAny;
				target = anchor;
			} else if ($linkingInput) {
				source = anchor;
				target = $linkingInput.anchor;
			} else if ($linkingOutput) {
				source = $linkingOutput.anchor;
				target = anchor;
			}
		} else if (input) {
			if ($linkingOutput) {
				source = $linkingOutput.anchor;
				target = anchor;
			} else if ($linkingAny) {
				source = $linkingAny;
				target = anchor;
			}
		} else if (output) {
			if ($linkingInput) {
				source = anchor;
				target = $linkingInput.anchor;
			} else if ($linkingAny) {
				source = anchor;
				target = $linkingAny;
			}
		}

		if (source && target) connectAnchors(source, target);

		connectStores();

		if (!$activeKeys['Shift']) {
			clearAllLinking();
		} else {
			if ($linkingInput) {
				$linkingOutput = null;
				$linkingAny = null;
			} else if ($linkingOutput) {
				$linkingInput = null;
				$linkingAny = null;
			} else if ($linkingAny) {
				$linkingInput = null;
				$linkingOutput = null;
			}
		}
	}

	// Updates the connected anchors set on source and target
	// Creates the edge and add it to the store
	function connectAnchors(source: Anchor, target: Anchor) {
		updatePosition(); // Just in case
		const newEdge = createEdge({ source, target }, source?.edge || null);
		source.connected.update((anchors) => anchors.add(target));
		target.connected.update((anchors) => anchors.add(source));
		const id = newEdge.id;
		edges.add(newEdge, id);
	}

	// If both anchors have stores, we "link" them
	function connectStores() {
		if (input && $linkingOutput && $linkingOutput.store) {
			if (
				$inputsStore &&
				key &&
				inputsStore &&
				typeof inputsStore.set === 'function' &&
				typeof inputsStore.update === 'function'
			)
				$inputsStore[key] = $linkingOutput.store;
		} else if (output && $linkingInput && $linkingInput.store) {
			const { store, key } = $linkingInput;
			if (store && key)
				store.update((store) => {
					if (!outputStore) return store;
					store[key] = outputStore;
					return store;
				});
		}
	}

	function disconnectStore() {
		if ($inputsStore && key && $inputsStore[key])
			$inputsStore[key] = writable(get($inputsStore[key]));
	}

	function clearAllLinking() {
		$linkingInput = null;
		$linkingOutput = null;
		$linkingAny = null;
	}

	// This just repeatedly calls updatePosition until cancelled
	function trackPosition() {
		if (!tracking) return;
		updatePosition();
		animationFrameId = requestAnimationFrame(trackPosition);
	}

	// This can be simplified/made more efficient
	const updatePosition = () => {
		if (!anchorElement) return;
		const { top, left, width, height } = anchorElement.getBoundingClientRect();

		const oldOffsetX = get(anchor.offset.x);
		const oldOffsetY = get(anchor.offset.y);

		const oldPositionX = get(anchor.position.x);
		const oldPositionY = get(anchor.position.y);

		const dimensions = get(graph.dimensions);
		const scale = get(graph.transforms.scale);

		const translationX = get(graph.transforms.translation.x);
		const translationY = get(graph.transforms.translation.y);

		const scaled = calculateRelativeCursor(
			{ clientX: left, clientY: top },
			dimensions.top,
			dimensions.left,
			dimensions.width,
			dimensions.height,
			scale,
			translationX,
			translationY
		);

		const deltaX = scaled.x - oldPositionX;
		const deltaY = scaled.y - oldPositionY;

		if (deltaX !== 0) anchor.offset.x.set(oldOffsetX + deltaX + width / scale / 2);
		if (deltaY !== 0) anchor.offset.y.set(oldOffsetY + deltaY + height / scale / 2);
	};

	// Destroy the edge and disconnect the anchors/stores
	function destroy() {
		edges.delete('cursor');

		anchor.connected.update((connectedAnchors) => {
			Array.from(connectedAnchors).forEach((connectedAnchor) => {
				edges.delete(sortEdgeKey(anchor.id, connectedAnchor.id));
				connectedAnchor.connected.update((connectedAnchorConnections) => {
					connectedAnchorConnections.delete(anchor);
					return connectedAnchorConnections;
				});
			});
			return new Set();
		});

		clearAllLinking();
		disconnectStore();
	}

	function disconnect() {
		if (get(anchor.connected).size > 1) return;

		const source = Array.from(get(anchor.connected))[0];

		if (source.type === 'input') return;

		destroy();

		if (source.type === 'output') {
			createCursorEdge(source, null);
			disconnectStore();
			const store: ReturnType<typeof generateOutput> = source.store as ReturnType<
				typeof generateOutput
			>;
			$linkingOutput = { anchor: source, store };
		} else {
			createCursorEdge(source, null);
			$linkingAny = source;
		}
	}

	function checkConnections() {
		connections.forEach((connection) => {
			const [node, nodeAnchor] = connection;
			const nodekey: NodeKey = `N-${node}`;
			const connectedNode = graph.nodes.get(nodekey);

			if (!connectedNode) return;
			const anchorKey: AnchorKey = `A-${nodeAnchor}/${nodekey}`;
			const connectedAnchor = connectedNode.anchors.get(anchorKey);

			if (!connectedAnchor) return;
			connectAnchors(anchor, connectedAnchor);
			connections.filter((c) => c !== connection);
		});
	}

	function handleMouseUp() {
		if (isSelf()) return;
		if ($linkingAny || $linkingInput || $linkingOutput) connectEdge();
	}

	function isSelf() {
		return (
			$linkingAny === anchor ||
			$linkingInput?.anchor === anchor ||
			$linkingOutput?.anchor === anchor
		);
	}
</script>

<div
	class="anchor-wrapper"
	id={anchor?.id}
	bind:this={anchorElement}
	on:mouseenter={() => (hovering = true)}
	on:mouseleave={() => (hovering = false)}
	on:mousedown|stopPropagation|preventDefault={handleClick}
	on:mouseup|stopPropagation={handleMouseUp}
>
	<slot linked={connected} {hovering} {connecting}>
		<div
			class="svelvet-anchor"
			class:output
			class:input
			class:connected
			class:connecting
			class:hovering
			style:--default-width={`${ANCHOR_SIZE}px`}
			style:background-color={bgColor}
			style:--default-radius={ANCHOR_RADIUS}
		/>
	</slot>
</div>

<style>
	.anchor-wrapper {
		z-index: 10;
		/* border: solid 1px black; */
		width: fit-content;
		height: fit-content;
		pointer-events: all;
	}

	.svelvet-anchor {
		width: var(--anchor-size, var(--default-width));
		height: var(--anchor-size, var(--default-width));
		z-index: 12;
		border-radius: var(--anchor-radius, var(--default-radius));
		background-color: var(--anchor-color, var(--default-color));
		cursor: pointer;
		border: solid 1px black;
		pointer-events: auto;
	}
	/* .connected.input {
		background-color: white;
	}
	.connected.output {
		background-color: white;
	} */

	.connecting {
		background-color: white;
	}

	.hovering {
		background-color: rgb(123, 123, 123);
	}
	.output {
		border-color: white;
	}
	.input {
		border-color: rgb(255, 255, 255);
	}
	div {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
	}
	/* reset button styles */
</style>
