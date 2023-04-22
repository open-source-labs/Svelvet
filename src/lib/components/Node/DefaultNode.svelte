<script lang="ts">
	import { getContext } from 'svelte';
	import type { Node } from '$lib/types';
	import Anchor from '$lib/components/Anchor/Anchor.svelte';
	import { get } from 'svelte/store';
	import Resizer from '$lib/components/Resizer/Resizer.svelte';

	export let selected: boolean;

	const node = getContext<Node>('node');

	const label = node.label;
	const bgColor = node.bgColor;
	const borderRadius = node.borderRadius;
	const textColor = node.textColor;
	const inputs = node.inputs;
	const outputs = node.outputs;
	const width = node.dimensions.width;
	const height = node.dimensions.height;
	const resizable = node.resizable;

	let top = get(node.direction) === 'TD' ? true : false;
	let bottom = get(node.direction) === 'TD' ? true : false;

	let left = get(node.direction) === 'TD' ? false : true;
	let right = get(node.direction) === 'TD' ? false : true;
</script>

<div class:selected class="default-node" style:border-radius="{$borderRadius}px">
	<div class="input-anchors" class:top class:left>
		{#each { length: $inputs } as _, i}
			<Anchor on:connection on:disconnection input direction={top ? 'north' : 'west'} />
		{/each}
	</div>
	<div class="output-anchors" class:bottom class:right>
		{#each { length: $outputs } as _, i}
			<Anchor on:connection on:disconnection output direction={top ? 'south' : 'east'} />
		{/each}
	</div>
	<p style:color={$textColor}>{$label}</p>

	{#if $resizable}
		<Resizer width height rotation />
	{/if}
</div>

<style>
	:root {
		--shadow-color: 0deg 0% 10%;
		--shadow-elevation-low: 0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.4),
			0.4px 0.8px 1px -1.2px hsl(var(--shadow-color) / 0.34),
			1px 2px 2.5px -2.5px hsl(var(--shadow-color) / 0.34);
		--shadow-elevation-medium: 0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.42),
			0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.1),
			2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.1),
			5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.1);
	}
	.default-node {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		box-sizing: border-box;
		width: inherit;
		height: inherit;
	}
	p {
		font-size: 20px;
		line-height: 20px;
		text-align: center;
		user-select: none;
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
