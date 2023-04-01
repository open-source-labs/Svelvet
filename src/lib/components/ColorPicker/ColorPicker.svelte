<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { Parameter } from '$lib/types';
	import { cursorPosition } from '$lib/stores/CursorStore';

	// export let options: Array<string>;
	export let parameterStore: Writable<Parameter>;

	// Local state for radio group selection
	// let initial = 0;
	let yteaheya = '#FF0000';
	// // We want to update the store with the text value, not the index
	// $: parameterStore.set(options[initial]);
	function handleChange(event) {
		$parameterStore = event.target.value;
	}

	function handleSlide(event) {
		console.log(event);
	}
</script>

<input
	on:mousedown={handleSlide}
	type="color"
	class="color-picker"
	bind:value={$parameterStore}
	on:input={handleChange}
/>

<style>
	.color-picker {
		width: 150px;
		height: 30px;
	}

	.option {
		cursor: pointer;
	}
</style>
