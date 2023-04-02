<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	export let placeholder: string;
	const textStore = getContext<Writable<string>>('textStore');
</script>

<input {placeholder} type="text" bind:value={$textStore} />
