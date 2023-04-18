<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	export let placeholder: string;
	const textStore = getContext<Writable<string>>('textStore');
</script>

<input
	on:keydown|stopPropagation
	on:click|stopPropagation
	on:mousedown|stopPropagation
	{placeholder}
	type="text"
	bind:value={$textStore}
/>
