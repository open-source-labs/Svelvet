<script lang="ts">
	import type { Graph, Node, Connections, CSSColorString, EdgeStyle, EdgeConfig } from '$lib/types';
	import type { ThemeGroup, Anchor, Direction, AnchorKey, CustomWritable } from '$lib/types';
	import type { InputType, NodeKey, OutputStore, InputStore } from '$lib/types';
	import { onMount, getContext, onDestroy, beforeUpdate } from 'svelte';
	import type { Writable, Readable } from 'svelte/store';
	import { ANCHOR_SIZE, ANCHOR_RADIUS } from '$lib/constants';
	import { writable } from 'svelte/store';
	import { createEdge, createAnchor, generateOutput } from '$lib/utils/creators';
	import { calculateRelativeCursor } from '$lib/utils/calculators';
	import { get } from 'svelte/store';
	import { sortEdgeKey } from '$lib/utils/helpers/sortKey';
	import { createEventDispatcher } from 'svelte';
	import type { ComponentType } from 'svelte';

	const dispatch = createEventDispatcher();

	const node = getContext<Node>('node');
	const graph = getContext<Graph>('graph');
	const graphDirection = getContext<string>('direction');
	const themeStore = getContext<Writable<ThemeGroup>>('themeStore');
	const graphEdge = getContext<ComponentType>('graphEdge');

	export let bgColor: CSSColorString | null = null;

	export let id: string | number = 0;
	export let input = false;
	export let output = false;
	export let multiple = output ? true : input ? false : true;
	export let direction: Direction =
		graphDirection === 'TD' ? (input ? 'north' : 'south') : input ? 'west' : 'east';
	export let dynamic = false;
	export let edge: ComponentType | null = null;
	export let inputsStore: InputStore | null = null;
	export let key: string | number | null = null;
	export let outputStore: OutputStore | null = null;
	export let connections: Connections = [];
	export let edgeColor:
		| Writable<CSSColorString | null>
		| CustomWritable<CSSColorString>
		| Readable<CSSColorString> = writable(null);
	export let edgeLabel = '';
	export let locked = false;
	export let edgeStyle: EdgeStyle | null = null;

	const mounted = getContext<Writable<number | true>>('mounted');

	let animationFrameId: number;
	let anchorElement: HTMLDivElement;
	let anchor: Anchor;
	let tracking = false;
	let hovering = false;
	let previousConnectionCount = 0;
	let type: InputType = input === output ? null : input ? 'input' : 'output';
	let assignedConnections: Connections = [];

	const nodeEdge = node.edge;
	const anchors = node.anchors;
	const edges = graph.edges;
	const resizingWidth = node.resizingWidth;
	const resizingHeight = node.resizingHeight;
	const rotating = node.rotating;
	const nodeLevelConnections = node.connections;
	const linkingInput = graph.linkingInput;
	const linkingOutput = graph.linkingOutput;
	const linkingAny = graph.linkingAny;

	$: connecting =
		input === output
			? $linkingAny === anchor
			: input
			? $linkingInput?.anchor === anchor
			: $linkingOutput?.anchor === anchor;
	$: connectedAnchors = anchor && anchor.connected;

	// On mount, we query the dom to capture the position of the anchor
	// We then create the anchor object and add it to the store
	onMount(() => {
		const { top, left, width, height } = anchorElement.getBoundingClientRect();
		const anchorKey: AnchorKey = `A-${id || anchors.count() + 1}/${node.id}`;

		const anchorPosition = { y: top, x: left };
		anchor = createAnchor(
			node,
			anchorKey,
			anchorPosition,
			{ width, height },
			inputsStore || outputStore || null,
			edge || nodeEdge || graphEdge || null,
			type,
			direction,
			dynamic,
			key,
			edgeColor
		);

		anchors.add(anchor, anchor.id);

		if (!input) {
			const poppedConnections = $nodeLevelConnections?.pop();
			if (poppedConnections) assignedConnections = poppedConnections;
		}

		// This is to avoid a strange bug where the anchor positions are off
		// It only seems to happen in dev and doesn't seem to affect the final product
		setTimeout(() => {
			updatePosition();
		}, 0);
	});

	beforeUpdate(() => {
		updatePosition();
	});

	// When the anchor is destroyed we remove the edge and cancel any animation
	onDestroy(() => {
		destroy();
		cancelAnimationFrame(animationFrameId);
	});

	$: if ($mounted === graph.nodes.count() && connections.length) {
		checkDirectConnections();
	}

	// // If the user has specifcied connections, we check once all nodes have mounted
	$: if ($mounted === graph.nodes.count() && assignedConnections.length) {
		checkNodeLevelConnections();
	}

	$: {
		$connectedAnchors;
		updatePosition();
	}

	// If an anchor is added to the store, we update all anchor positions
	$: if (anchorElement) {
		$anchors;
		updatePosition();
	}

	// If the parent node is resizing, we actively track the position of the anchor
	$: if (!tracking && ($resizingWidth || $resizingHeight || $rotating)) {
		tracking = true;
		trackPosition();
	} else if (!$resizingWidth && !$resizingHeight && tracking && !$rotating) {
		tracking = false;
		cancelAnimationFrame(animationFrameId);
	}

	// This fires the connection/disconnection events
	// We track previous connections and fire a correct event accordingly
	$: if ($connectedAnchors) {
		if ($connectedAnchors.size < previousConnectionCount) {
			dispatch('disconnection', { node, anchor });
		} else if ($connectedAnchors.size > previousConnectionCount) {
			dispatch('connection', { node, anchor });
		}
		previousConnectionCount = $connectedAnchors.size;
	}

	function handleClick(e: MouseEvent) {
		updatePosition(); // Just in case the anchor has moved
		if (locked) return; // Return if the anchor is locked
		if (!e.shiftKey) clearAllLinking(); // If the shift key isn't pressed, clear all linking

		// If the Anchor being clicked has connections
		// And it can't have multiple connections
		// And there isn't an active connection being made
		// Then this is a disconnection event
		if ($connectedAnchors?.size && !multiple && !$linkingInput && !$linkingOutput && !$linkingAny)
			return disconnect();

		// If there isn't an active connection being made, start a new edge
		if (!$linkingInput && !$linkingOutput && !$linkingAny) return startEdge();

		// If there is an active connection being made
		// Proceed with the edge connection logic
		if (input === output) {
			connectEdge(e);
		} else if (input) {
			if ($linkingInput) return; // If you're trying to connect inputs to each other, return
			if ($linkingOutput || $linkingAny) connectEdge(e);
		} else if (output) {
			if ($linkingOutput) return; // If you're trying to connect outputs to each other, return
			if ($linkingInput || $linkingAny) connectEdge(e);
		}
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

	function createCursorEdge(source: Anchor | null, target: Anchor | null, disconnect = false) {
		const edgeConfig: EdgeConfig = {
			color: edgeColor,
			label: { text: edgeLabel }
		};
		if (disconnect) edgeConfig.disconnect = true;
		if (edgeStyle) edgeConfig.type = edgeStyle;
		// Create a temporary edge to track the cursor
		const newEdge = createEdge({ source, target }, source?.edge || null, edgeConfig);
		// Add the edge to the store
		edges.add(newEdge, 'cursor');
	}

	function connectEdge(e: MouseEvent) {
		// Delete the temporary edge
		edges.delete('cursor');

		if (
			$linkingAny === anchor ||
			$linkingOutput?.anchor === anchor ||
			$linkingInput?.anchor === anchor
		) {
			clearAllLinking();
			return;
		}
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

		if (!e.shiftKey) {
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
		const edgeConfig: EdgeConfig = {
			color: edgeColor,
			label: { text: edgeLabel }
		};
		if (edgeStyle) edgeConfig.type = edgeStyle;
		const newEdge = createEdge({ source, target }, source?.edge || null, edgeConfig);

		target.connected.update((anchors) => anchors.add(source));
		source.connected.update((anchors) => anchors.add(target));
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

	// Disconnect edge and create a new cursor edge
	function disconnect() {
		if (get(anchor.connected).size > 1) return;

		const source = Array.from(get(anchor.connected))[0];

		if (source.type === 'input') return;

		destroy();

		if (source.type === 'output') {
			createCursorEdge(source, null, true);
			disconnectStore();
			const store: ReturnType<typeof generateOutput> = source.store as ReturnType<
				typeof generateOutput
			>;
			$linkingOutput = { anchor: source, store };
		} else {
			createCursorEdge(source, null, true);
			$linkingAny = source;
		}
	}

	function checkNodeLevelConnections() {
		assignedConnections.forEach((connection, index) => {
			if (!connection) return;
			const connected = processConnection(connection);
			if (connected) connections[index] = null;
		});
		assignedConnections = assignedConnections.filter((connection) => connection !== null);
	}

	function checkDirectConnections() {
		connections.forEach((connection, index) => {
			if (!connection) return;
			const connected = processConnection(connection);
			if (connected) connections[index] = null;
		});

		connections = connections.filter((connection) => connection !== null);
	}

	const processConnection = (connection: [string | number, string | number] | string | number) => {
		let nodeId: string;
		let anchorId: string | null;
		let anchorToConnect: Anchor | null = null;

		if (Array.isArray(connection)) {
			nodeId = connection[0].toString();
			anchorId = connection[1].toString();
		} else {
			nodeId = connection.toString();
			anchorId = null;
		}

		//Convert to node key used in store/DOM
		const nodekey: NodeKey = `N-${nodeId}`;
		// Look up node in store
		const nodeToConnect = graph.nodes.get(nodekey);
		if (!nodeToConnect) {
			return false;
		}

		if (!anchorId) {
			// Connect to the anchor with the fewest connections
			const anchorStore = get(nodeToConnect.anchors);
			const anchors = Object.values(anchorStore);

			if (!anchors.length) {
				return false;
			}
			anchorToConnect = anchors.reduce<Anchor | null>((a, b) => {
				if (!a && b.type === 'output') return null;
				if (b.type === 'output') return a;
				if (!a) return b;
				if (get(b.connected).size < get(a.connected).size) return b;
				return a;
			}, null);
		} else {
			// Create anchor key
			const anchorKey: AnchorKey = `A-${anchorId}/${nodekey}`;
			// Look up anchor in store
			anchorToConnect = nodeToConnect.anchors.get(anchorKey) || null;
		}

		if (!anchorToConnect) {
			return false;
		}

		connectAnchors(anchor, anchorToConnect);

		if (anchorToConnect.store && (inputsStore || outputStore)) {
			if (input && anchorToConnect.type === 'output') {
				if (
					$inputsStore &&
					key &&
					inputsStore &&
					typeof inputsStore.set === 'function' &&
					typeof inputsStore.update === 'function'
				)
					$inputsStore[key] = anchorToConnect.store;
			} else if (output && anchorToConnect.type === 'input') {
				const { store, inputKey } = anchorToConnect;
				if (store && inputKey && typeof store.update === 'function')
					store.update((store) => {
						if (!outputStore) return store;
						store[inputKey] = outputStore;
						return store;
					});
			}
		}
		return true;
	};

	function handleMouseUp(e: MouseEvent) {
		if (isSelf()) return;
		if ($connectedAnchors?.size && !multiple) {
			edges.delete('cursor');
			clearAllLinking();
			return;
		}
		if ($linkingAny || $linkingInput || $linkingOutput) connectEdge(e);
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
	class:locked
	bind:this={anchorElement}
	on:mouseenter={() => (hovering = true)}
	on:mouseleave={() => (hovering = false)}
	on:mousedown|stopPropagation|preventDefault={handleClick}
	on:mouseup|stopPropagation={handleMouseUp}
>
	<slot linked={$connectedAnchors?.size >= 1} {hovering} {connecting}>
		<div
			class="svelvet-anchor"
			class:output
			class:input
			class:connected={$connectedAnchors?.size >= 1}
			class:connecting
			class:hovering
			style:--default-width={`${ANCHOR_SIZE}px`}
			style:background-color={bgColor || $themeStore.anchor}
			style:--default-radius={ANCHOR_RADIUS}
		/>
	</slot>
</div>

<style>
	* {
		box-sizing: border-box;
	}
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
	.output {
		border-color: white;
	}
	.input {
		border-color: rgb(255, 255, 255);
	}
	.locked {
		cursor: not-allowed !important;
	}
	div {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
	}
</style>
