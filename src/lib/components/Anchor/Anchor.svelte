<script lang="ts">
	import type { Graph } from '$lib/types';
	import { onMount, getContext } from 'svelte';
	import { get } from 'svelte/store';

	export let isOutput = false;
	export let label: string;
	export let graph: Graph;

	let anchor: HTMLButtonElement;

	// const graph = graphStore.get(getContext('graphId'));
	const { nodes } = graph;
	const node = nodes.get(getContext('nodeId'));

	onMount(() => {
		const { anchors } = get(node);
		const { offsetLeft, offsetTop, offsetHeight, offsetWidth } = anchor;
		anchors[label] = { x: offsetLeft + offsetWidth / 2, y: offsetTop + offsetHeight / 2 };
	});

	let color = 'gray';
	$: side = isOutput ? 'right' : 'left';
</script>

<button
	bind:this={anchor}
	style="
		--color: {color};
		{side}: {-6}px;"
	class="anchor"
/>

<style>
	.anchor {
		position: absolute;
		width: 12px;
		z-index: 2;
		height: 12px;
		border-radius: 50%;
		background-color: var(--color);
		cursor: pointer;
		border: solid 1px black;
		pointer-events: auto;
	}
	.anchor:hover {
		background-color: white;
	}
	/* reset button styles*/
	button {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
	}
</style>
