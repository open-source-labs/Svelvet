<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { Parameter } from '$lib/types';

	export let options: Array<string>;
	export let parameterStore: Writable<Parameter>;

	// Local state for radio group selection
	let initial = 0;

	// We want to update the store with the text value, not the index
	$: parameterStore.set(options[initial]);

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

<div
	role="radiogroup"
	class="group-container"
	tabindex={0}
	on:keydown|stopPropagation={cycleThrougGroup}
>
	{#each options as label, index}
		<label class="label">
			<input
				class="option"
				type="radio"
				id={slugify(label)}
				bind:group={initial}
				value={index}
				tabindex={index === 0 ? 0 : -1}
				on:change={() => {
					initial = index;
				}}
			/>
			<p>{label}</p>
		</label>
	{/each}
</div>

<style>
	.label {
		cursor: pointer;
		margin-right: 0.5rem;
		user-select: none;
		display: flex;
	}
	.group-container {
		width: 100%;
		display: flex;
		align-items: center;
	}

	p {
		margin-left: 0.5rem;
	}

	.option {
		cursor: pointer;
		width: 100%;
	}
</style>
