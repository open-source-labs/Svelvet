<script lang="ts">
	import type { Graph, Node, InputKey, OutputKey } from '$lib/types';
	import { onMount, getContext } from 'svelte';
	import { ANCHOR_COLOR, ANCHOR_SIZE, ANCHOR_RADIUS } from '$lib/constants';
	import type { Writable } from 'svelte/store';

	export let isOutput = false;

	const label = getContext<string>('label');
	const driven = getContext<Writable<boolean>>('driven');
	const node = getContext<Node>('node');

	let anchor: HTMLButtonElement;

	$: anchors = node.anchors;

	onMount(() => {
		const { offsetLeft, offsetTop, offsetHeight, offsetWidth } = anchor;
		const ioKey: InputKey | OutputKey = `${isOutput ? 'O' : 'I'}-${label}/${node.id}`;

		anchors[ioKey] = {
			x: offsetLeft + offsetWidth / 2,
			y: offsetTop + offsetHeight / 2
		};
	});

	$: side = isOutput ? 'right' : 'left';
</script>

<button
	style:--default-width={`${ANCHOR_SIZE}px`}
	style:--default-color={ANCHOR_COLOR}
	style:--default-radius={ANCHOR_RADIUS}
	class:driven={$driven}
	bind:this={anchor}
	style="{side}: -6px"
	class="anchor"
/>

<style>
	.anchor {
		position: absolute;
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
	/* reset button styles*/
	button {
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
