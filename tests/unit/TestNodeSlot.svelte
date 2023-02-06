<script lang="ts">
  import Node from '$lib/nodes/views/Node.svelte';

  export let node: any;
</script>

<Node {node}>{node.data.label}</Node>
