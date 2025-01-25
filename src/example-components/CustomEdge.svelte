<script lang="ts">
	import Edge from '$lib/components/Edge/Edge.svelte';
	import type { CSSColorString } from '$lib/types';

	let color: CSSColorString = 'yellow';
	let edge: Edge = $state();
</script>

<Edge
	{color}
	bind:this={edge}
	width={4}
	edgeClick={() => edge.destroy()}
	labelPosition={0.8}
	animate
>
	{#snippet label()}
		<button id="destroy-edge" onclick={edge.destroy} >Custom Label</button>
	{/snippet}
</Edge>

<style>
	#destroy-edge {
		background-color: #fff;
		border: none;
		border-radius: 5px;
		padding: 5px;
	}
</style>
