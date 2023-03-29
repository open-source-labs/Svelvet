<script>
	import Anchor from '../Anchor/Anchor.svelte';
	import Slider from '../Slider/Slider.svelte';
	export let input;
	export let label;
	export let config;
	export let object;
	export let connectable = false;

	const { type, value, min, max, step, rounding } = config;
</script>

<div class="input">
	<Slider {label} {min} {max} {step} {rounding} value={input} />
	{#if connectable}
		<Anchor {input} {object} {label} />
	{/if}
</div>

<style>
	.input {
		/* border: solid 1px green; */
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 20px;
	}
</style>
