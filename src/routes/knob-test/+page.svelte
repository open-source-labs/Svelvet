<script lang="ts">
	import { Svelvet, Node } from '$lib';
	import InputNode from '../../example-components/InputNode.svelte';
	import { generateInput, generateOutput, Knob, Resizer } from '$lib';
	import NodeWrapper from '../../example-components/test-components/NodeWrapper.svelte';
	import Output from '../../example-components/test-components/Output.svelte';
	import Scale from '../../example-components/test-components/Scale.svelte';
	import Volume from '../../example-components/test-components/Volume.svelte';
	type Inputs = {
		degree: number;
	};
</script>

<body>
	<Svelvet>
		<Volume />

		<Scale />

		<Output />
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
