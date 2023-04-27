<script lang="ts">
	import { Svelvet, Node } from '$lib';
	import FitContent from '../../example-components/FitContent.svelte';
	import Percent from '../../example-components/Percent.svelte';
	import PxValue from '../../example-components/PxValue.svelte';
</script>

<body>
	<Svelvet theme="dark" minimap>
		<Node id="no-dimensions" resizable />
		<Node id="dimensions" dimensions={{ width: 400, height: 200 }} resizable />
		<Node id="v6-props" width={600} height={300} resizable />
		<Node id="both" dimensions={{ width: 150, height: 10 }} width={600} height={300} resizable />
		<Node id="v6-width" width={600} resizable />
		<Node id="v6-height" height={300} resizable />
		<Node id="width-only" dimensions={{ width: 100 }} resizable />
		<FitContent />
		<PxValue />
		<Percent />
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
