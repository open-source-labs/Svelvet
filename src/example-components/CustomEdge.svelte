<script lang="ts">
	import Edge from '$lib/components/Edge/Edge.svelte';
	import { getRandomColor } from '$lib/utils';
	import type { CSSColorString } from '$lib/types';

	let color: CSSColorString = 'yellow';

	function randomColor() {
		color = getRandomColor();
	}
</script>

<Edge {color} let:destroy width={4} edgeClick={() => (color = 'blue')}>
	<button id="destroy-edge" on:click={destroy} slot="label">DynamicEdges</button>
</Edge>

<style>
	#destroy-edge {
		background-color: #fff;
		border: none;
		border-radius: 5px;
		padding: 5px;
	}
</style>
