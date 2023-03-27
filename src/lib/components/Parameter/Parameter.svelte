<script lang="ts">
	import Slider from '../Slider/Slider.svelte';

	export let type: string;
	export let value: number | string;
	export let driveable: boolean;
</script>

{#if driveable}
	<Input />
{/if}

<div class="parameter-wrapper">
	{#if type === 'slider'}
		<Slider {value} />
	{/if}
</div>

{#if mode === 'output'}
	<Output />
{/if}

<style>
	.parameter-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
