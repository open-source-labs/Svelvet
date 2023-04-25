<script lang="ts">
	import { Svelvet, Node } from '$lib';
	import CustomNode from '../example-components/CustomNode.svelte';
	import CustomEdge from '../example-components/CustomEdge.svelte';
	import InputNode from '../example-components/InputNode.svelte';
</script>

<body>
	<Svelvet edgeStyle="step" edge={CustomEdge} TD theme="dark" zoom={0.6} minimap>
		<CustomNode />
		<InputNode />
		<Node center position={{ x: -200, y: 200 }} id="NODE" label="NODE" resizable />
	</Svelvet>
</body>

<style>
	body {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: gray;
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
	}
</style>
