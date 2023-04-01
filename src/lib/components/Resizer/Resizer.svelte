<!-- ParentComponent.svelte -->
<script lang="ts">
	import ResizeHandle from './ResizeHandle.svelte';
	import type { Graph } from '$lib/types';

	export let width = false;
	export let height = false;
	export let both = false;
	export let graph: Graph;
</script>

<svelte:component this={width ? ResizeHandle : null} width {graph} />
<svelte:component this={height ? ResizeHandle : null} height {graph} />
<svelte:component this={both ? ResizeHandle : null} both {graph} />
