<script lang="ts">
	export let outputStore;

	const { value1, value2, radio, color1, color2, color3 } = $outputStore;
	console.log($outputStore);
</script>

<div
	class="visualizer"
	style="background-color: {$outputStore.color2}"
	on:mousedown|stopPropagation
>
	{#each Array($outputStore.value1).fill(0) as _, x}
		<div
			class:circle={$outputStore.radio === 'circle'}
			style="background-color: {$outputStore.color1}; width: {$outputStore.value2}px; height: {$outputStore.value2}px;"
			class="cell"
		/>
	{/each}
</div>

<style>
	.visualizer {
		width: 200px;
		height: 200px;
		pointer-events: none;
		user-select: none;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		gap: 4px;
		border: solid 1px black;
		overflow: hidden;
		margin: 0;
	}

	.circle {
		border-radius: 50%;
	}

	.cell {
		border: solid 1px black;
	}
</style>
