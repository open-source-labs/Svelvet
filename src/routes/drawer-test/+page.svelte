<script lang="ts">
	import { Svelvet, Node, Drawer} from '$lib';
	import InputNode from '../../example-components/InputNode.svelte';
	import type { NodeConfig } from '$lib/types';
	import { createNode } from '$lib/utils';

	
</script>

<Drawer>
	<Svelvet drawer height={800}>

	</Svelvet>
</Drawer>



<style>
	body {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
	}
</style>