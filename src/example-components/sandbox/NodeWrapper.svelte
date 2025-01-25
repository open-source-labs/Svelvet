<script lang="ts">
	import { Anchor, generateOutput } from '$lib';
	import CustomAnchor from './CustomAnchor.svelte';

	interface Props {
		title: string;
		outputStore?: ReturnType<typeof generateOutput> | null;
		key?: string;
		destroy?: null | (() => void);
		children?: import('svelte').Snippet;
	}

	let {
		title,
		outputStore = null,
		key = '',
		destroy = null,
		children
	}: Props = $props();
</script>

<div class="node">
	<div class="header">
		<h1>{title}</h1>
		{#if destroy}
			<button class="destroy" onclick={destroy}>X</button>
		{/if}
	</div>
	{@render children?.()}
</div>
{#if outputStore && key}
	<div class="output-anchors">
		<Anchor
			id={key}
			connections={[['output', key]]}
			
			
			
			{outputStore}
			output
		>
			{#snippet children({ linked, connecting, hovering })}
						<CustomAnchor {hovering} {connecting} {linked} />
								{/snippet}
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
