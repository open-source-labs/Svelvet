import type { GraphDimensions, NodeStore, XYPair } from '$lib/types';
import type { Writable, Readable } from 'svelte/store';
import { writable, get } from 'svelte/store';
import { calculateRelativeCursor } from '../calculators';
import { tracking } from '$lib/stores/CursorStore';

export function createBoundsStore(
	nodes: NodeStore,
	dimensions: Readable<GraphDimensions>,
	scale: Writable<number>,
	translation: Writable<XYPair>
) {
	const top = writable(Infinity);
	const left = writable(Infinity);
	const right = writable(-Infinity);
	const bottom = writable(-Infinity);
	const nodeBounds = writable({
		top: Infinity,
		left: Infinity,
		right: -Infinity,
		bottom: -Infinity
	});
	let animationFrame: number;
	let graphDimensions = get(dimensions);
	let graphScale = get(scale);
	let graphTranslation = get(translation);
	let graphWidth = graphDimensions.width / graphScale;
	let graphHeight = graphDimensions.height / graphScale;

	function recalculateBounds() {
		// This calculates the top left corner of the graph element
		// As if the "window" is being project on the graph itself
		// We are using a function that is not tailored for this and it should be refactored
		const { x: graphLeft, y: graphTop } = calculateRelativeCursor(
			{ clientX: graphDimensions.left, clientY: graphDimensions.top },
			graphDimensions.top,
			graphDimensions.left,
			graphDimensions.width,
			graphDimensions.height,
			graphScale,
			graphTranslation
		);
		const currentNodeBounds = get(nodeBounds);

		top.set(Math.min(currentNodeBounds.top, graphTop));
		left.set(Math.min(currentNodeBounds.left, graphLeft));
		right.set(Math.max(currentNodeBounds.right, graphLeft + graphWidth));
		bottom.set(Math.max(currentNodeBounds.bottom, graphHeight + graphTop));
	}

	function recalculateNodeBounds(tracking = false) {
		let newTop = Infinity;
		let newLeft = Infinity;
		let newRight = -Infinity;
		let newBottom = -Infinity;

		for (const node of nodes.getAll()) {
			const { x, y } = get(node.position);
			const width = get(node.dimensions.width);
			const height = get(node.dimensions.height);
			newLeft = Math.min(newLeft, x);
			newTop = Math.min(newTop, y);
			newRight = Math.max(newRight, x + width);
			newBottom = Math.max(newBottom, y + height);
		}

		nodeBounds.set({ top: newTop, left: newLeft, right: newRight, bottom: newBottom });
		recalculateBounds();
		if (tracking) animationFrame = requestAnimationFrame(() => recalculateNodeBounds(tracking));
	}

	nodes.subscribe((nodes) => {
		recalculateNodeBounds();
		for (const node of nodes.values()) {
			node.dimensions.width.subscribe(() => {
				recalculateNodeBounds();
			});
			node.dimensions.height.subscribe(() => {
				recalculateNodeBounds();
			});
		}
	});

	tracking.subscribe((tracking) => {
		if (tracking) recalculateNodeBounds(tracking);
		if (!tracking) cancelAnimationFrame(animationFrame);
	});

	dimensions.subscribe(() => {
		graphDimensions = get(dimensions);
		graphWidth = graphDimensions.width / graphScale;
		graphHeight = graphDimensions.height / graphScale;
		recalculateBounds();
	});
	scale.subscribe(() => {
		graphScale = get(scale);
		graphWidth = graphDimensions.width / graphScale;
		graphHeight = graphDimensions.height / graphScale;
		recalculateBounds();
	});
	translation.subscribe(() => {
		graphTranslation = get(translation);
		recalculateBounds();
	});

	return { top, left, right, bottom, nodeBounds };
}
