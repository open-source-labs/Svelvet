<script lang="ts">
	import { Svelvet, Node} from '$lib';
	import InputNode from '../../example-components/InputNode.svelte';
	import {  Drawer } from '$lib';	
</script>

<body>
	<Svelvet drawer>
		<Node useDefaults>
        
		</Node>
	</Svelvet>
</body>

<style>
	body {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
	}
</style>