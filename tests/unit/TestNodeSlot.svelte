<script lang="ts">
	import Node from '$lib/Nodes/index.svelte';

	export let node: any;
</script>

<Node {node}>{node.data.label}</Node>
