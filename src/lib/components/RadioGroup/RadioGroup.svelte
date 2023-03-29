<script lang="ts">
	import { activeKeys } from '$lib/stores';
	import type { Writable } from 'svelte/store';

	import type { Parameter } from '$lib/types';

	export let options: Array<string>;
	export let parameterStore: Writable<Parameter>;

	let initial = 0;

	$: parameterStore.set(options[initial]);

	console.log({ parameterStore });
	const slugify = (str = '') => str.toLowerCase().replace(/ /g, '-').replace(/./g, '');
</script>

<div role="radiogroup" class="group-container">
	{#each options as label, index}
		<input type="radio" id={slugify(label)} bind:group={initial} value={index} />
		<label for={slugify(label)}> {label} </label>
	{/each}
</div>

<style>
	.input {
		background: linear-gradient(
			90deg,
			rgb(91, 169, 190) var(--percentage),
			rgb(255, 255, 255) var(--percentage)
		);
		border: solid 1px rgb(57, 57, 57);
		border-radius: 6px;
		text-align: right;
	}

	.input:active {
		cursor: none;
	}

	.input-label {
		margin-right: 0.5rem;
	}
</style>
