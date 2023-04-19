<script lang="ts">
	import Edge from '$lib/components/Edge/Edge.svelte';
	import { getRandomColor } from '$lib/utils';
	import type { CSSColorString } from '$lib/types';

	let color: CSSColorString = 'yellow';

	function randomColor() {
		color = getRandomColor();
	}
</script>

<Edge {color} let:path width={4}>
	<div slot="label">Custom Label</div>
</Edge>

<style>
	div {
		width: fit-content;
		height: 2rem;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgb(229, 10, 10);
	}
</style>
