<script lang="ts">
	export let nodeId: string;
	export let mode: string;
	export let direction: string = 'TD';

	$: axis = direction === 'TD' ? 'Y' : 'X';
</script>

<div
	on:click={() => {
		console.log('clicked');
	}}
	style="transform: {mode === 'input' ? `translate${axis}(-50%)` : `translate${axis}(50%)`}"
	class="anchor"
	id={nodeId}
/>

<style>
	.anchor {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: rgb(100, 100, 100);
		z-index: 10;
		cursor: pointer;
		transform: translateY(50%);
	}
</style>
