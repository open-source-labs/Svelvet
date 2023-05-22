<script lang="ts">
	import { Svelvet, Node, Drawer} from '$lib';
	import InputNode from '../../example-components/InputNode.svelte';
	import type { NodeConfig } from '$lib/types';
	import { createNode } from '$lib/utils';

	
</script>

<body>
	<div dropzone knob>
		<Svelvet height drawer>
	</div>
</body>


<Svelvet slot='drawer'>
	<slot></slot>
</Svelvet>

<style>
	body {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
	}
</style>