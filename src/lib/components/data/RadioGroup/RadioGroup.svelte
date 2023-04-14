<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { Parameter } from '$lib/types';
	import type { CustomWritable } from '$lib/types';
	import { writable } from 'svelte/store';

	export let options: Array<string>;
	export let parameterStore: CustomWritable<string>;

	// Local state for radio group selection
	let initial = 0;

	// We want to update the store with the text value, not the index
	$: $parameterStore = options[initial];

	const slugify = (str = '') => str.toLowerCase().replace(/ /g, '-').replace(/./g, '');

	function cycleThrougGroup(event: KeyboardEvent) {
		const key = event.key;

		// Allows us to use tab to navigate to the next element
		// But stops the page from scrolling due to the arrow keys
		if (key !== 'Tab') event.preventDefault();

		if (key === 'ArrowRight' || key === 'ArrowDown') {
			initial = (initial + 1) % options.length;
		} else if (key === 'ArrowLeft' || key === 'ArrowUp') {
			initial = (initial - 1 + options.length) % options.length;
		}
	}
</script>

{#each options as label, index}
	<label>
		<input
			on:click|stopPropagation={() => {
				initial = index;
			}}
			class="option"
			type="radio"
			id={slugify(label)}
			bind:group={initial}
			value={index}
			tabindex={index === 0 ? 0 : -1}
		/>
		{label}
	</label>
{/each}

<style>
	.option {
		cursor: pointer;
		width: 100%;
	}
</style>
