<script lang="ts">
	import { getContext } from 'svelte';
	import type { Node } from '$lib/types';
	import Anchor from '$lib/components/Anchor/Anchor.svelte';

	export let grabHandle: (node: HTMLElement) => void;
	export let selected: boolean;

	const node = getContext<Node>('node');
	const direction = getContext<string>('direction');

	let top = direction === 'TD' ? true : false;
	let bottom = direction === 'TD' ? true : false;

	let left = direction === 'TD' ? false : true;
	let right = direction === 'TD' ? false : true;

	$: nodeDirection = node.direction;
	$: label = node.label;
	$: bgColor = node.bgColor;
	$: borderRadius = node.borderRadius;
	$: borderColor = node.borderColor;
	$: textColor = node.textColor;
	$: inputs = node.inputs;
	$: outputs = node.outputs;
</script>

<div
	use:grabHandle
	style:background-color={$bgColor}
	style:border-radius={$borderRadius + 'px'}
	style:border-color={$borderColor}
	class:selected
	class="default-node"
>
	<div class="input-anchors" class:top class:left>
		{#each { length: $inputs } as _, i}
			<Anchor input />
		{/each}
	</div>
	<div class="output-anchors" class:bottom class:right>
		{#each { length: $outputs } as _, i}
			<Anchor output />
		{/each}
	</div>
	<p style:color={$textColor}>{$label}</p>
</div>

<style>
	:root {
		--shadow-color: 0deg 0% 15%;
		--shadow-elevation-low: 0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.34),
			0.4px 0.8px 1px -1.2px hsl(var(--shadow-color) / 0.34),
			1px 2px 2.5px -2.5px hsl(var(--shadow-color) / 0.34);
		--shadow-elevation-medium: 0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.36),
			0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.36),
			2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.36),
			5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.36);
		--shadow-elevation-high: 0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.34),
			1.5px 2.9px 3.7px -0.4px hsl(var(--shadow-color) / 0.34),
			2.7px 5.4px 6.8px -0.7px hsl(var(--shadow-color) / 0.34),
			4.5px 8.9px 11.2px -1.1px hsl(var(--shadow-color) / 0.34),
			7.1px 14.3px 18px -1.4px hsl(var(--shadow-color) / 0.34),
			11.2px 22.3px 28.1px -1.8px hsl(var(--shadow-color) / 0.34),
			17px 33.9px 42.7px -2.1px hsl(var(--shadow-color) / 0.34),
			25px 50px 62.9px -2.5px hsl(var(--shadow-color) / 0.34);
	}
	.default-node {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		border: solid 1px black;
		box-shadow: var(--shadow-elevation-medium);
	}
	p {
		font-size: 20px;
		line-height: 20px;
		text-align: center;
	}
	.selected {
		border: solid 1px white !important;
	}

	.input-anchors,
	.output-anchors {
		display: flex;
		position: absolute;
		justify-content: center;
		align-items: center;
		z-index: 1;
		pointer-events: none;
	}

	.top,
	.bottom {
		padding: 0px 20px;
		width: 100%;
		justify-content: space-around;
	}

	.top {
		transform: translate(0px, -50%);
		top: 0px;
	}

	.bottom {
		transform: translate(0px, 50%);
		bottom: 0px;
	}

	.left,
	.right {
		padding: 20px 0px;
		height: 100%;
		flex-direction: column;
		justify-content: space-around;
	}

	.left {
		transform: translate(-50%);
		left: 0px;
	}

	.right {
		transform: translate(50%);
		right: 0px;
	}
</style>
