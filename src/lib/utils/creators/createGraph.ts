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
	locked?: boolean;
}
export function createGraph(id: GraphKey, config: GraphConfig): Graph {
	const { initialZoom, editable, direction, locked } = config;

	const translation = {
		x: writable(0),
		y: writable(0)
	};
	const dimensions = writable({} as DOMRect);

	const scale = writable(initialZoom);

	const nodes = createStore<Node, NodeKey>();
	const bounds = createBoundsStore(nodes, dimensions, scale, translation.x, translation.y);

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
		linkingInput: writable(null),
		linkingOutput: writable(null),
		linkingAny: writable(null),
		editing: writable(null),
		cursor: createDerivedCursorStore(cursorPositionRaw, dimensions, translation, scale),
		locked: writable(locked || false),
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

function createBoundsStore(
	nodes: NodeStore,
	dimensions: Readable<DOMRect>,
	scale: Writable<number>,
	translationX: Writable<number>,
	translationY: Writable<number>
) {
	const top = writable(Infinity);
	const left = writable(Infinity);
	const right = writable(-Infinity);
	const bottom = writable(-Infinity);

	function recalculateBounds() {
		let newTop = Infinity;
		let newLeft = Infinity;
		let newRight = -Infinity;
		let newBottom = -Infinity;
		const graphDimensions = get(dimensions);
		const graphScale = get(scale);
		const xTranslation = get(translationX);
		const yTranslation = get(translationY);

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
		const DOMcorner = { clientX: graphDimensions.left, clientY: graphDimensions.top };

		// This calculates the top left corner of the graph element
		// As if the "window" is being project on the graph itself
		// We are using a function that is not tailored for this and it should be refactored
		const { x: graphLeft, y: graphTop } = calculateRelativeCursor(
			DOMcorner,
			graphDimensions.top,
			graphDimensions.left,
			graphDimensions.width,
			graphDimensions.height,
			graphScale,
			xTranslation,
			yTranslation
		);

		const graphWidth = graphDimensions.width / graphScale;
		const graphHeight = graphDimensions.height / graphScale;

		top.set(Math.min(newTop, graphTop));
		left.set(Math.min(newLeft, graphLeft));
		right.set(Math.max(newRight, graphLeft + graphWidth));
		bottom.set(Math.max(newBottom, graphHeight + graphTop));
	}

	nodes.subscribe(($nodes) => {
		for (const node of Object.values($nodes)) {
			node.position.x.subscribe(() => {
				recalculateBounds();
			});

			node.position.y.subscribe(() => {
				recalculateBounds();
			});

			node.dimensions.width.subscribe(() => {
				recalculateBounds();
			});
			node.dimensions.height.subscribe(() => {
				recalculateBounds();
			});
		}
	});

	dimensions.subscribe(() => {
		recalculateBounds();
	});
	scale.subscribe(() => {
		recalculateBounds();
	});
	translationX.subscribe(() => {
		recalculateBounds();
	});
	translationY.subscribe(() => {
		recalculateBounds();
	});

	return { top, left, right, bottom };
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
