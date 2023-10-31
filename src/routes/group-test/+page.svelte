<script lang="ts">
	import { Svelvet, Group, Node } from '$lib';
</script>

<Svelvet minimap controls theme={'dark'} width={800} height={850}>
	<Group position={{ x: 200, y: 200 }} width={400} height={300} groupName="nodes">
		<Node position={{ x: 100, y: 100 }} label="Inside" dimensions={{ width: 100, height: 100 }} />
	</Group>
	<Node position={{ x: 650, y: 350 }} label="Right" dimensions={{ width: 100, height: 100 }} />
	<Node position={{ x: 50, y: 350 }} label="Left" dimensions={{ width: 100, height: 100 }} />
	<Node position={{ x: 350, y: 50 }} label="Top" dimensions={{ width: 100, height: 100 }} />
	<Node position={{ x: 350, y: 650 }} label="Bottom" dimensions={{ width: 100, height: 100 }} />
</Svelvet>
