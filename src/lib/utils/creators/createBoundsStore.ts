import type { GraphDimensions, NodeStore, XYPair } from '$lib/types';
import type { Writable, Readable } from 'svelte/store';
import { writable, get } from 'svelte/store';
import { calculateRelativeCursor } from '../calculators';
import { tracking, resizing } from '$lib/stores/CursorStore';

export function createBoundsStore(
	nodes: NodeStore,
	dimensions: Readable<GraphDimensions>,
	scale: Writable<number>,
	translation: Writable<XYPair>
) {
	//EL PROBLEMA QUE TENEMOS AQUI ES QUE NO ESTA LLEGANDO NADA EN EL ARGUMENTO nodes. SE ESPERA UN STORE DE NODES PERO NO HAY NADA
	const graphBounds = writable({
		top: Infinity,
		left: Infinity,
		right: -Infinity,
		bottom: -Infinity
	});
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

		graphBounds.set({
			top: Math.min(currentNodeBounds.top, graphTop),
			left: Math.min(currentNodeBounds.left, graphLeft),
			right: Math.max(currentNodeBounds.right, graphLeft + graphWidth),
			bottom: Math.max(currentNodeBounds.bottom, graphHeight + graphTop)
		});
	}

	function recalculateNodeBounds(tracking = false) {
		let newTop = Infinity;
		let newLeft = Infinity;
		let newRight = -Infinity;
		let newBottom = -Infinity;

		for (const node of nodes.getAll()) {
			console.log('dentro del for, este es e node:', node);
			//ESTAS PROPIEDADES DEBEN CONSERVARSE DE TIPO STORE PORQUE OTROS COMPONENTES DEPENDEN DE ESTAS PROPIEDAES
			const { x, y } = get(node.position); 
			const width = get(node.dimensions.width); 
			const height = get(node.dimensions.height); 
			// const { x, y } = node.position;
			// const width = node.dimensions.width;
			// const height = node.dimensions.height;
			newLeft = Math.min(newLeft, x);
			newTop = Math.min(newTop, y);
			newRight = Math.max(newRight, x + width);
			newBottom = Math.max(newBottom, y + height);
		}

		nodeBounds.set({ top: newTop, left: newLeft, right: newRight, bottom: newBottom });
		recalculateBounds();
		if (tracking) animationFrame = requestAnimationFrame(() => recalculateNodeBounds(tracking));
	}

	//AQUI nodes ES EL ARGUMENTO QUE RECIBE LA FUNCION PADRE, SE ESPERA UN STORE DE NODES PERO NO ESTA LLEGANDO NADA
	nodes.subscribe(() => {
		console.log('dentro del nodes.subscribe...........Aqui no estan llegando los nodes');
		recalculateNodeBounds();
	});

	resizing.subscribe((resizing) => {
		if (resizing) recalculateNodeBounds(resizing);
		if (!resizing) cancelAnimationFrame(animationFrame);
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

	return { graphBounds, nodeBounds };
}
