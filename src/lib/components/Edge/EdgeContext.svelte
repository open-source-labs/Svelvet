<script lang="ts">
	import type { WritableEdge } from '$lib/types';
	import { setContext } from 'svelte';

	export let edge: WritableEdge;

	setContext('edge', edge);
</script>

<slot />
