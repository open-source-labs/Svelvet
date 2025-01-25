<script lang="ts">
	import type { CustomWritable } from '$lib/types';

	$props = {
		options: [],
		parameterStore: null
	};

	$state = {
		initial: 0
	};

	$effect(() => {
		$props.parameterStore = $props.options[$state.initial];
	});

	const slugify = (str = '') => str.toLowerCase().replace(/ /g, '-').replace(/./g, '');

	function cycleThroughGroup(event: KeyboardEvent) {
		const key = event.key;

		// Allows us to use tab to navigate to the next element
		// But stops the page from scrolling due to the arrow keys
		if (key !== 'Tab') event.preventDefault();
		event.stopPropagation();
		if (key === 'ArrowRight' || key === 'ArrowDown') {
			$state.initial = ($state.initial + 1) % $props.options.length;
		} else if (key === 'ArrowLeft' || key === 'ArrowUp') {
			$state.initial = ($state.initial - 1 + $props.options.length) % $props.options.length;
		}
	}
</script>

<div class="radio-group" role="radiogroup" onkeydown={cycleThroughGroup} tabindex={0}>
	{#each $props.options as label, index}
		<button
			onmousedown={() => {
				$state.initial = index;
			}}
			aria-checked={$state.initial === index}
			aria-label={label}
			role="radio"
		>
			<label class="option-wrapper">
				<input class="option" type="radio" id={slugify(label)} bind:group={$state.initial} value={index} />
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
