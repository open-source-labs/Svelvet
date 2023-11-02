<script lang="ts">
	import { Svelvet, Node, Anchor, Edge } from '$lib';
	import ArrowEdge from './ArrowEdge.svelte';
</script>

<Svelvet minimap controls theme={'dark'} width={1200} height={800}>
	<Node
		position={{ x: 100, y: 200 }}
		dimensions={{ width: 100, height: 100 }}
		TD
		label={'TD-OUT'}
		edge={ArrowEdge}
	/>
	<Node position={{ x: 100, y: 500 }} dimensions={{ width: 100, height: 100 }} TD label={'TD-IN'} />
</Svelvet>
