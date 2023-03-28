<script>
	import Anchor from '../Anchor/Anchor.svelte';
	import Slider from '../Slider/Slider.svelte';
	export let output;
	export let label;
	export let store;
	//const { type, value, min, max, step, rounding, label, driven } = input;
</script>

<div class="input">
	<p>{$store}</p>
	<Anchor object={store} {label} type="output" />
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
		/* border: solid 1px green; */
		display: flex;
		align-items: center;
		align-self: end;
		justify-content: center;
	}

	p {
		margin: 0;
	}
</style>
