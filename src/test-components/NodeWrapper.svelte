<script lang="ts">
	import { Anchor, generateOutput } from '$lib';
	import CustomAnchor from './CustomAnchor.svelte';

	export let title: string;
	export let outputStore: ReturnType<typeof generateOutput> | null = null;
	export let key = '';
</script>

<div class="node">
	<h1>{title}</h1>
	<slot />
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
</div>

<style>
	.node {
		box-sizing: border-box;
		width: fit-content;
		height: fit-content;
		border-radius: 8px;
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
		border-bottom: solid 1px white;
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
</style>
