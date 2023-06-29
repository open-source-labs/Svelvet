<script lang="ts">
	import type { CustomWritable } from '$lib/types';

	export let options: Array<string>;
	export let parameterStore: CustomWritable<string>;

	// Local state for radio group selection
	let initial = 0;

	// We want to update the store with the text value, not the index
	$: $parameterStore = options[initial];

	const slugify = (str = '') => str.toLowerCase().replace(/ /g, '-').replace(/./g, '');

	function cycleThroughGroup(event: KeyboardEvent) {
		const key = event.key;

		// Allows us to use tab to navigate to the next element
		// But stops the page from scrolling due to the arrow keys
		if (key !== 'Tab') event.preventDefault();
		event.stopPropagation();
		if (key === 'ArrowRight' || key === 'ArrowDown') {
			initial = (initial + 1) % options.length;
		} else if (key === 'ArrowLeft' || key === 'ArrowUp') {
			initial = (initial - 1 + options.length) % options.length;
		}
	}
</script>

<div class="radio-group" role="radiogroup" on:keydown={cycleThroughGroup} tabindex={0}>
	{#each options as label, index}
		<button
			on:mousedown|stopPropagation={() => {
				initial = index;
			}}
		>
			<label class="option-wrapper">
				<input class="option" type="radio" id={slugify(label)} bind:group={initial} value={index} />
				<p>{label}</p>
			</label>
		</button>
	{/each}
</div>

<style>
	p {
		line-height: 1rem;
		padding: 0;
		margin: 0;
	}
	.option-wrapper {
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.25rem;
	}

	.radio-group {
		display: flex;
		width: 100%;
		justify-content: space-evenly;
		height: 1.5rem;
	}
</style>
