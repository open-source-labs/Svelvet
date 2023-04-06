<script lang="ts">
	import type {
		Graph,
		Node,
		Anchor,
		Direction,
		EdgeKey,
		WrappedWritable,
		AnchorKey,
		InputType
	} from '$lib/types';
	import { onMount, getContext } from 'svelte';
	import { ANCHOR_COLOR, ANCHOR_SIZE, ANCHOR_RADIUS } from '$lib/constants';
	import { writable, type Writable } from 'svelte/store';
	import { createEdge, createAnchor, calculateRelativeCursor, generateOutput } from '$lib/utils';
	import { get } from 'svelte/store';
	import { generateKey } from '$lib/utils';
	import { activeKeys } from '$lib/stores';

	const driven = getContext<Writable<boolean>>('driven');
	const node = getContext<Node>('node');
	const graph = getContext<Graph>('graph');
	const graphDirection = getContext<string>('direction');

	export let key: string | null = null;
	export let input: boolean = false;
	export let output: boolean = false;
	export let inputsStore: Writable<WrappedWritable<unknown>> | null = null;
	export let outputStore: ReturnType<typeof generateOutput> | null = null;
	export let multiple = output ? true : input ? false : true;
	export let label = generateKey();
	export let direction: Direction =
		graphDirection === 'TD' ? (input ? 'north' : 'south') : input ? 'west' : 'east';
	export let dynamic = false;

	let animationFrameId: number;
	let edgeKey: EdgeKey;
	let anchorElement: HTMLButtonElement;
	let anchorWidth: number;
	let anchorHeight: number;
	let anchor: Anchor;
	let tracking = false;
	let hovering = false;

	let type: InputType = input === output ? null : input ? 'input' : 'output';

	const id: AnchorKey = `A-${input ? 'I' : 'O'}-${label}/${node.id}`;

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

	onMount(() => {
		const { x, y } = anchorElement.getBoundingClientRect();

		const anchorPosition = { x, y };
		anchor = createAnchor(
			node,
			id,
			anchorPosition,
			anchorDimensions,
			inputsStore || outputStore || null,
			type,
			direction,
			dynamic
		);
		anchors.add(anchor, id);
	});

	// If an anchor is added to the store, we update all anchor positions
	$: if (anchorElement) {
		$anchors;
		updatePosition();
	}
	$: {
		if (!$activeKeys['Shift']) clearAllLinking();
	}

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

	function handleClick() {
		updatePosition();
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
		const newEdge = createEdge({ source, target });
		// Add the edge to the store
		edges.add(newEdge, 'cursor');
	}

	function connectEdge() {
		console.log('Connecting Edge');
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

		let newEdge;
		// Creat edge
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

		if (source && target) {
			newEdge = createEdge({ source, target });
			source!.connected.update((anchors) => anchors.add(target!));
			target!.connected.update((anchors) => anchors.add(source!));
			edgeKey = newEdge.id;
			edges.add(newEdge, edgeKey);
		}

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

	function connectStores() {
		if (input && $linkingOutput && $linkingOutput.store) {
			if ($inputsStore && key) $inputsStore[key] = $linkingOutput.store;
		} else if (output && $linkingInput && $linkingInput.store) {
			const { store, key } = $linkingInput;
			if (store && key) store.update((s) => ({ ...s, [key]: outputStore }));
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

	function trackPosition() {
		if (!tracking) return;
		updatePosition();
		animationFrameId = requestAnimationFrame(trackPosition);
	}

	const updatePosition = () => {
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

	function destroy() {
		edges.delete(edgeKey);
		edges.delete('cursor');
		anchor.connected.update((connectedAnchors) => {
			Array.from(connectedAnchors).forEach((connectedAnchor) => {
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
			$linkingOutput = { anchor: source, store: source.store };
		} else {
			createCursorEdge(source, null);
			$linkingAny = source;
		}
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

<button
	class="wrapper"
	bind:this={anchorElement}
	bind:clientWidth={anchorWidth}
	bind:clientHeight={anchorHeight}
	on:mousedown|stopPropagation|preventDefault={handleClick}
	on:mouseup|stopPropagation={handleMouseUp}
>
	<slot {hovering} {connected}>
		<div
			class="anchor"
			class:output
			class:input
			class:connected
			class:connecting
			class:hovering
			style:--default-width={`${ANCHOR_SIZE}px`}
			style:--default-color={'black' || ANCHOR_COLOR}
			style:--default-radius={ANCHOR_RADIUS}
		/>
	</slot>
</button>

<style>
	.wrapper {
		z-index: 100;
		/* border: solid 1px black; */
		width: fit-content;
		height: fit-content;
		pointer-events: auto;
	}

	.anchor {
		width: var(--anchor-size, var(--default-width));
		height: var(--anchor-size, var(--default-width));
		z-index: 12;
		border-radius: var(--anchor-radius, var(--default-radius));
		background-color: var(--anchor-color, var(--default-color));
		cursor: pointer;
		border: solid 1px black;
		pointer-events: auto;
	}
	.connected.input {
		background-color: red;
	}
	.connected.output {
		background-color: rgb(255, 251, 0);
	}

	.connecting {
		background-color: white;
	}

	.hovering {
		background-color: rgb(221, 214, 206);
	}
	.output {
		border-color: yellow;
	}
	.input {
		border-color: rgb(255, 0, 0);
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
	button {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
	}
</style>
