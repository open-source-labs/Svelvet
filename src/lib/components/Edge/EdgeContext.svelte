<script lang="ts">
	import type { WritableEdge } from '$lib/types';
	import { setContext } from 'svelte';

	interface Props {
		edge: WritableEdge;
		children?: import('svelte').Snippet;
	}

	let { edge, children }: Props = $props();

	setContext('edge', edge);
</script>

{@render children?.()}
