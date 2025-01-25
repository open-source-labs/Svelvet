<script lang="ts">
	import { createBubbler, stopPropagation } from 'svelte/legacy';

	const bubble = createBubbler();
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	interface Props {
		placeholder: string;
	}

	let { placeholder }: Props = $props();
	const textStore = getContext<Writable<string>>('textStore');
</script>

<input
	onkeydown={stopPropagation(bubble('keydown'))}
	onclick={stopPropagation(bubble('click'))}
	onmousedown={stopPropagation(bubble('mousedown'))}
	{placeholder}
	type="text"
	bind:value={$textStore}
/>
