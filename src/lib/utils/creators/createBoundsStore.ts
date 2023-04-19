import type { GraphDimensions, NodeStore } from '$lib/types';
import type { Writable, Readable } from 'svelte/store';
import { writable, get } from 'svelte/store';
import { calculateRelativeCursor } from '../calculators';
import { tracking } from '$lib/stores/CursorStore';

export function createBoundsStore(
	nodes: NodeStore,
	dimensions: Readable<GraphDimensions>,
	scale: Writable<number>,
	translationX: Writable<number>,
	translationY: Writable<number>
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

	function recalculateBounds(tracking = false) {
		let newTop = Infinity;
		let newLeft = Infinity;
		let newRight = -Infinity;
		let newBottom = -Infinity;
		const graphDimensions = get(dimensions);
		const graphScale = get(scale);
		const xTranslation = get(translationX);
		const yTranslation = get(translationY);

		for (const node of Object.values(get(nodes))) {
			const { x, y } = get(node.position);
			const width = get(node.dimensions.width);
			const height = get(node.dimensions.height);

			newLeft = Math.min(newLeft, x);
			newTop = Math.min(newTop, y);
			newRight = Math.max(newRight, x + width);
			newBottom = Math.max(newBottom, y + height);
		}

		nodeBounds.set({ top: newTop, left: newLeft, right: newRight, bottom: newBottom });

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

		if (tracking) animationFrame = requestAnimationFrame(() => recalculateBounds(tracking));
	}

	// This can be optimized
	nodes.subscribe(($nodes) => {
		for (const node of Object.values($nodes)) {
			node.dimensions.width.subscribe(() => {
				recalculateBounds();
			});
			node.dimensions.height.subscribe(() => {
				recalculateBounds();
			});
		}
	});

	tracking.subscribe((tracking) => {
		if (tracking) recalculateBounds(tracking);
		if (!tracking) cancelAnimationFrame(animationFrame);
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

	return { top, left, right, bottom, nodeBounds };
}
