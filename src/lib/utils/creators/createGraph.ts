import { writable, derived } from 'svelte/store';
import type { Readable } from 'svelte/store';
import type { Graph, Node, GroupBox, EdgeKey, GraphKey, GroupKey } from '$lib/types';
import { createStore } from './createStore';
import type { Writable } from 'svelte/store';
import { cursorPositionRaw } from '$lib/stores/CursorStore';
import { calculateRelativeCursor } from '$lib/utils/calculators/calculateRelativeCursor';
import type { WritableEdge, NodeKey } from '$lib/types';

export function createGraph(id: GraphKey, initialZoom: number): Graph {
	const bounds = {
		top: writable(Infinity),
		left: writable(Infinity),
		right: writable(-Infinity),
		bottom: writable(-Infinity)
	};

	const translation = {
		x: writable(0),
		y: writable(0)
	};
	const dimensions = writable({} as DOMRect);

	const scale = writable(initialZoom);

	const graph: Graph = {
		id,
		nodes: createStore<Node, NodeKey>(),
		edges: createStore<WritableEdge, EdgeKey>(),
		transforms: {
			translation,
			scale,
			cursor: {
				x: writable(0),
				y: writable(0)
			}
		},
		maxZIndex: writable(1),
		dimensions,
		bounds,
		connectingStore: writable(null),
		editing: writable(null),
		cursor: createDerivedCursorStore(cursorPositionRaw, dimensions, translation, scale),
		isLocked: writable(false),
		outputsRemoved: writable(new Set()),
		connectingFrom: writable(null),
		groups: writable({
			selected: { parent: writable(null), nodes: writable(new Set<Node>()) },
			hidden: { parent: writable(null), nodes: writable(new Set<Node>()) }
		}),
		groupBoxes: createStore<GroupBox, GroupKey>(),
		activeGroup: writable(null),
		initialNodePositions: writable([])
	};

	return graph;
}

function createDerivedCursorStore(
	cursorPositionRaw: Readable<{ x: number; y: number }>,
	dimensions: Graph['dimensions'],
	translation: { x: Writable<number>; y: Writable<number> },
	scale: Writable<number>
): Readable<{ x: number; y: number }> {
	const cursorPosition: Readable<{ x: number; y: number }> = derived(
		[cursorPositionRaw, dimensions, translation.x, translation.y, scale],
		([$cursorPositionRaw, $dimensions, $translationX, $translationY, $scale]) => {
			const e = {
				clientX: $cursorPositionRaw.x,
				clientY: $cursorPositionRaw.y
			};

			return calculateRelativeCursor(
				e,
				$dimensions.top,
				$dimensions.left,
				$dimensions.width,
				$dimensions.height,
				$scale,
				$translationX,
				$translationY
			);
		}
	);

	return cursorPosition;
}
