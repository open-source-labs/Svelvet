<script lang="ts">
	import type { Graph, Node, CustomWritable } from '$lib/types';
	// Props
	export let parameterStore: CustomWritable<number>;
	export let min: number = 0;
	export let max: number = 100;
	export let step: number = 1;
	export let label: string = 'Value';
	export let fixed: number = 2;
</script>
