<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { Parameter } from '$lib/types';
	import { getContext } from 'svelte';
	import { NODE_COLOR_DARK } from '$lib/constants';

	export let parameterStore: Writable<Parameter> = getContext('colorStore');
	const label = getContext<string>('label');

	function handleChange(event: Event) {
		if (event.target) {
			$parameterStore = (event.target as HTMLInputElement).value;
		}
	}
</script>

<div class="color-picker">
	{#if label}
		<p>{label}</p>
	{/if}
	<input
		type="color"
		id="color-input"
		class="color-input"
		bind:value={$parameterStore}
		on:input={handleChange}
		on:click|stopPropagation
	/>
	<label
		for="color-input"
		class="color-display"
		style="background-color: {$parameterStore !== null ? $parameterStore : NODE_COLOR_DARK}"
	/>
</div>

<style>
	p {
		margin-left: 0.5rem;
	}
	.color-picker {
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
		gap: 0.5rem;
		position: relative;
	}
	.color-input {
		width: 80%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		opacity: 0;
		cursor: pointer;
	}
	.color-display {
		width: 100%;
		height: 100%;
		border: 1px solid #ccc;
	}
</style>
