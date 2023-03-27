<script>
	import Anchor from '../Anchor/Anchor.svelte';
	import Slider from '../Slider/Slider.svelte';
	export let input;
	export let label;

	console.log(input);
	//const { type, value, min, max, step, rounding, label, driven } = input;
</script>

<div class="input">
	<Anchor />
	<Slider {label} value={input} />
</div>

<style>
	.anchor {
		width: 10px;
		height: 10px;
		background-color: white;
		border-radius: 50%;
		border: solid 1px black;
	}

	.input {
		border: solid 1px green;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
