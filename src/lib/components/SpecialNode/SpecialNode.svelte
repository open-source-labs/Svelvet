<script lang="ts">
	import { getContext, onMount, setContext, SvelteComponent } from 'svelte';
	import type { ComponentType } from 'svelte';
	import type { Graph, Node, Theme } from '$lib/types';
	import Parameter from '../Parameter/Parameter.svelte';
	import Output from '../Output/Output.svelte';
	import Resizer from '../Resizer/Resizer.svelte';
	import { calculateFitContentWidth } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';
	import * as s from '$lib/constants/styles';
	import { createNode } from '$lib/utils';

	export let position = { x: 0, y: 0 };
	export let dimensions = { width: 200, height: 100 };
	export let componentRef;
	export let props = {};

	export let node: Node = createNode({
		id: Math.random(),
		position,
		dimensions,
		component: componentRef,
		props
	});
	const graph = getContext<Graph>('graph');
	onMount(() => {
		graph.nodes.add(node);
		console.log(props);
	});
</script>
