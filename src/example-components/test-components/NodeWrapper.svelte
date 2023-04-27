<script lang="ts">
	import { Anchor, generateOutput } from '$lib';
	import CustomAnchor from './CustomAnchor.svelte';

	export let title: string;
	export let outputStore: ReturnType<typeof generateOutput> | null = null;
	export let key = '';
	export let destroy: null | (() => void) = null;
</script>

<div class="node">
	<div class="header">
		<h1>{title}</h1>
		{#if destroy}
			<button class="destroy" on:click={destroy}>X</button>
		{/if}
	</div>
	<slot />
</div>
{#if outputStore && key}
	<div class="output-anchors">
		<Anchor
			id={key}
			connections={[['output', key]]}
			let:linked
			let:connecting
			let:hovering
			{outputStore}
			output
		>
			<CustomAnchor {hovering} {connecting} {linked} />
		</Anchor>
	</div>
{/if}

<style>
	.node {
		box-sizing: border-box;
		width: fit-content;
		border-radius: 8px;
		height: fit-content;
		position: relative;
		pointer-events: auto;
		display: flex;
		flex-direction: column;
		padding: 10px;
		gap: 10px;
	}

	h1 {
		font-size: 0.9rem;
		font-weight: 200;
		padding: 0;
		margin: 0;
		display: flex;
		align-items: center;
		padding-bottom: 8px;
		border-color: inherit;
	}

	.output-anchors {
		position: absolute;
		right: -24px;
		top: 8px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.destroy {
		background: none;
		border: none;
		color: inherit;
		cursor: pointer;
		pointer-events: auto;
	}
	.header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		width: 100%;
		border-bottom: solid 1px;
		border-color: lightgray;
	}
</style>
