<script lang="ts">
	import { Svelvet, Node, Anchor, Edge } from '$lib';
	import ArrowEdge from './ArrowEdge.svelte';
	import ArrowEdgeBlue from './ArrowEdgeBlue.svelte';
</script>

<Svelvet minimap controls theme={'dark'} width={1200} height={800} endStyles={[null, 'arrow']}>
	<Node
		position={{ x: 100, y: 200 }}
		dimensions={{ width: 100, height: 100 }}
		TD
		label={'TD-OUT'}
		edge={ArrowEdge}
	/>
	<Node position={{ x: 100, y: 500 }} dimensions={{ width: 100, height: 100 }} TD label={'TD-IN'} />
	<Node
		position={{ x: 400, y: 200 }}
		dimensions={{ width: 100, height: 100 }}
		TD
		label={'TD-OUT-B'}
		edge={ArrowEdgeBlue}
	/>
	<Node
		position={{ x: 400, y: 500 }}
		dimensions={{ width: 100, height: 100 }}
		TD
		label={'TD-IN-B'}
	/>
	<Node position={{ x: 200, y: 100 }} dimensions={{ width: 100, height: 100 }} useDefaults>
		<Anchor output />
	</Node>
</Svelvet>
