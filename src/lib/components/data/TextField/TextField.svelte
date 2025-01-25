<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	$props = {
		placeholder: ''
	};

	const textStore = getContext<Writable<string>>('textStore');
</script>

<input
	onkeydown={event => event.stopPropagation()}
	onclick={event => event.stopPropagation()}
	onmousedown={event => event.stopPropagation()}
	{placeholder}
	type="text"
	bind:value={$textStore}
/>
