import { writable, derived } from 'svelte/store';
import type { Readable } from 'svelte/store';
import type { Graph, Node, GroupBox, EdgeKey, GraphKey, GroupKey, NodeStore } from '$lib/types';
import { createStore } from './createStore';
import type { Writable } from 'svelte/store';
import { cursorPositionRaw } from '$lib/stores/CursorStore';
import { calculateRelativeCursor } from '$lib/utils/calculators/calculateRelativeCursor';
import type { WritableEdge, NodeKey } from '$lib/types';
import { get } from 'svelte/store';
export interface GraphConfig {
	editable?: boolean;
	initialZoom?: number;
	direction?: 'TD' | 'LR';
}
export function createGraph(id: GraphKey, config: GraphConfig): Graph {
	const { initialZoom, editable, direction } = config;

	const translation = {
		x: writable(0),
		y: writable(0)
	};
	const dimensions = writable({} as DOMRect);

	const scale = writable(initialZoom);

	const nodes = createStore<Node, NodeKey>();
	const bounds = createBoundsStore(nodes);

	const graph: Graph = {
		id,
		nodes,
		edges: createStore<WritableEdge, EdgeKey>(),
		transforms: {
			translation,
			scale
		},
		maxZIndex: writable(1),
		dimensions,
		bounds,
		direction: direction || 'LR',
		editable: editable || false,
		connectingStore: writable(null),
		linkingInput: writable(null),
		linkingOutput: writable(null),
		linkingAny: writable(null),
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

function createBoundsStore(nodes: NodeStore) {
	const top = writable(Infinity);
	const left = writable(Infinity);
	const right = writable(-Infinity);
	const bottom = writable(-Infinity);

	function recalculateBounds() {
		let newTop = Infinity;
		let newLeft = Infinity;
		let newRight = -Infinity;
		let newBottom = -Infinity;

		for (const node of Object.values(get(nodes))) {
			const x = get(node.position.x);
			const y = get(node.position.y);
			const width = get(node.dimensions.width);
			const height = get(node.dimensions.height);

			newLeft = Math.min(newLeft, x);
			newTop = Math.min(newTop, y);
			newRight = Math.max(newRight, x + width);
			newBottom = Math.max(newBottom, y + height);
		}

		top.set(newTop);
		left.set(newLeft);
		right.set(newRight);
		bottom.set(newBottom);
	}

	nodes.subscribe(($nodes) => {
		for (const node of Object.values($nodes)) {
			node.position.x.subscribe(() => {
				recalculateBounds();
			});

			node.position.y.subscribe(() => {
				recalculateBounds();
			});
		}
	});

	return { top, left, right, bottom };
}

export function calculateBounds(nodes: Node[]) {
	console.log('BOUNDS BOUNDS BOUNDS');
	const leftValues = nodes.map((n) => get(n.position.x));
	const topValues = nodes.map((n) => get(n.position.y));
	const rightValues = nodes.map((n) => get(n.position.x) + get(n.dimensions.width));
	const bottomValues = nodes.map((n) => get(n.position.y) + get(n.dimensions.height));

	const minX = Math.min(...leftValues);
	const maxX = Math.max(...rightValues);
	const minY = Math.min(...topValues);
	const maxY = Math.max(...bottomValues);

	const width = maxX - minX;
	const height = maxY - minY;

	return {
		minX,
		maxX,
		minY,
		maxY,
		width,
		height
	};
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
