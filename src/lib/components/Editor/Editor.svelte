<script lang="ts">
	import Slider from '../data/Slider/Slider.svelte';
	import TextField from '../data/TextField/TextField.svelte';
	import type { Graph } from '$lib/types';
	import type { Writable } from 'svelte/store';

	import { getContext, onMount, setContext } from 'svelte';

	import type { CSSColorString, Node as SvelvetNode } from '$lib/types';
	import Node from '../Node/Node.svelte';

	export let editing: SvelvetNode;
	const graph = getContext<Graph>('graph');
	setContext<Graph>('graph', graph);
	setContext<Writable<string | null>>('textStore', editing.label);
	setContext<Writable<CSSColorString | null>>('colorStore', editing.bgColor);

	$: dimenions = graph.dimensions;
	$: cursor = graph.cursor;

	function deleteNode() {
		graph.nodes.delete(editing.id);
		graph.editing.set(null);
	}
</script>

<Node
	let:grabHandle
	zIndex={Infinity}
	position={{ x: $cursor.x, y: $cursor.y }}
	bgColor="white"
	id="editor"
>
	<div use:grabHandle class="editor">
		<button on:click={() => graph.editing.set(null)}>X</button>
		<Slider parameterStore={editing.dimensions.width} max={1000} />
		<TextField placeholder={'Node Label'} />
		<button on:click={deleteNode}>Delete Node</button>
	</div>
</Node>

<style>
	div {
		--shadow-color: 0deg 0% 0%;
		--shadow-elevation-high: 0px 0.6px 0.6px hsl(var(--shadow-color) / 0.12),
			0.1px 2.5px 2.5px -0.5px hsl(var(--shadow-color) / 0.11),
			0.2px 4.7px 4.8px -0.9px hsl(var(--shadow-color) / 0.11),
			0.4px 8.2px 8.3px -1.4px hsl(var(--shadow-color) / 0.1),
			0.6px 14px 14.2px -1.9px hsl(var(--shadow-color) / 0.09),
			1px 22.9px 23.2px -2.3px hsl(var(--shadow-color) / 0.09),
			1.5px 35.9px 36.4px -2.8px hsl(var(--shadow-color) / 0.08),
			2.3px 53.9px 54.6px -3.2px hsl(var(--shadow-color) / 0.07);
		border: solid 1px rgb(153, 153, 153);
		position: absolute;
		border-radius: 6px;
		z-index: 100;
		width: 150px;
		padding: 10px;
		height: 200px;
		background-color: rgb(243, 237, 237);
		box-shadow: var(--shadow-elevation-high);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 4rem;
		gap: 10px;
	}

	.editor {
		background-color: rgb(31, 30, 30);
		width: 200px;
		height: 300px;
	}
</style>
