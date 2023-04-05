<script lang="ts">
	import type {
		Graph,
		Node,
		Anchor,
		OutputKey,
		InputKey,
		Direction,
		EdgeKey,
		Parameter,
		Inputs
	} from '$lib/types';
	import { onMount, getContext } from 'svelte';
	import { ANCHOR_COLOR, ANCHOR_SIZE, ANCHOR_RADIUS } from '$lib/constants';
	import { writable, type Writable } from 'svelte/store';
	import { createEdge, createAnchor, calculateRelativeCursor, generateOutput } from '$lib/utils';
	import { get } from 'svelte/store';
	import { generateKey } from '$lib/utils';

	const driven = getContext<Writable<boolean>>('driven');
	const node = getContext<Node>('node');
	const graph = getContext<Graph>('graph');

	export let key: string | null = null;
	export let input: boolean = false;
	export let inputs: Writable<Inputs | null> = writable(null);
	export let output: ReturnType<typeof generateOutput> | null = null;

	export let label = generateKey();
	export let direction: Direction = input ? 'west' : 'east';
	export let dynamic = false;

	let animationFrameId: number;
	let edgeKey: EdgeKey;
	let anchorElement: HTMLDivElement;
	let anchorWidth: number;
	let anchorHeight: number;
	let anchor: Anchor<true> | Anchor<false>;
	let tracking = false;

	const id: InputKey | OutputKey = `${input ? 'I' : 'O'}-${label}/${node.id}`;

	$: anchors = node.anchors;
	$: edges = graph.edges;
	$: scale = graph.transforms.scale;
	$: resizingWidth = node.resizingWidth;
	$: resizingHeight = node.resizingHeight;
	$: connectingFrom = graph.connectingFrom;
	$: connectingStore = graph.connectingStore;

	$: anchorDimensions = {
		width: anchorWidth / $scale,
		height: anchorHeight / $scale
	};

	onMount(() => {
		const { x, y } = anchorElement.getBoundingClientRect();

		const anchorPosition = { x, y };

		anchor = createAnchor<typeof input>(
			node,
			id,
			anchorPosition,
			anchorDimensions,
			input,
			direction,
			dynamic
		);
		anchors.add(anchor, id);
	});

	$: if (!tracking && ($resizingWidth || $resizingHeight)) {
		tracking = true;
		trackPosition();
	} else if (!$resizingWidth && !$resizingHeight && tracking) {
		tracking = false;
		cancelAnimationFrame(animationFrameId);
	}

	let isOutput = !input;

	function startEdge() {
		$connectingFrom = anchor;
		if (isOutput) {
			$connectingStore = output;
		} else {
			if ($inputs) $connectingStore = inputs;
		}
		const newEdge = createEdge({
			source: input ? null : (anchor as Anchor<false>),
			target: input ? (anchor as Anchor<true>) : null
		});
		edgeKey = newEdge.id;
		edges.add(newEdge, 'cursor');
	}

	function connectEdge() {
		edges.delete('cursor');
		if (input) {
			console.log('INPUT', $connectingStore);
			if ($inputs && key && $connectingStore) $inputs[key] = $connectingStore;
		} else {
			$connectingStore = $inputs;
		}
		const newEdge = createEdge({
			source: input ? ($connectingFrom as Anchor<false>) : (anchor as Anchor<false>),
			target: input ? (anchor as Anchor<true>) : ($connectingFrom as Anchor<true>)
		});
		edgeKey = newEdge.id;
		edges.add(newEdge, edgeKey);
	}

	const trackPosition = () => {
		if (!tracking) return;
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
		// Call trackPosition again on the next frame
		animationFrameId = requestAnimationFrame(trackPosition);
	};
</script>

<div
	on:mousedown|stopPropagation|preventDefault={startEdge}
	on:mouseup|stopPropagation={connectEdge}
	bind:this={anchorElement}
	bind:clientWidth={anchorWidth}
	bind:clientHeight={anchorHeight}
	class="z-index"
>
	<slot>
		<div
			class="anchor"
			style:--default-width={`${ANCHOR_SIZE}px`}
			style:--default-color={'black' || ANCHOR_COLOR}
			style:--default-radius={ANCHOR_RADIUS}
			class:driven={$driven}
		/>
	</slot>
</div>

<style>
	.z-index {
		z-index: 100;
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
	.anchor:hover {
		background-color: white;
	}

	div {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
	}
	.driven {
		background-color: white;
	}
</style>
