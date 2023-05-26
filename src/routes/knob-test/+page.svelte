<script lang="ts">
	import { Svelvet, ThemeToggle, Node } from '$lib';
	// import type { Theme } from 'svelvet';
	import InputNode from '../../example-components/InputNode.svelte';
	import { generateInput, generateOutput, Knob, Resizer } from '$lib';
	import NodeWrapper from '../../example-components/test-components/NodeWrapper.svelte';
	import Output from '../../example-components/test-components/Output.svelte';
	import Volume from '../../example-components/test-components/Volume.svelte';
	import Bass from '../../example-components/test-components/Bass.svelte';
	import Treble from '../../example-components/test-components/Treble.svelte';
	import Audio from '../../example-components/test-components/Audio.svelte';
	import KnobOutputDisplayer from '../../example-components/test-components/KnobOutputDisplayer.svelte';
	import CircleColor from '../../example-components/test-components/CircleColor.svelte';

	type Inputs = {
		degree: number;
	};
</script>

<body>
	<Svelvet>
		<Volume />
		<Treble />
		<Bass />
		<Audio />
		<!-- <CircleColor /> -->
		<ThemeToggle main="light" alt="dark" slot="toggle" />
		<!-- <KnobOutputDisplayer /> -->
	</Svelvet>
</body>

<style>
	body {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
	}

	:root[svelvet-theme='dark'] {
		--node-color: hsl(225, 30%, 50%);
		--node-border-color: hsl(225, 20%, 40%);
		--node-selection-color: hsl(45, 90%, 60%);
		--text-color: hsl(0, 0%, 100%);
		--node-shadow: var(--shadow-elevation-medium);

		--background-color: hsl(225, 20%, 27%);
		--dot-color: hsl(225, 10%, 50%);

		--accent-color: hsl(45, 90%, 60%);
		--primary-color: hsl(225, 30%, 66%);

		--edge-color: hsl(0, 0%, 100%);
		--target-edge-color: hsl(225, 20%, 40%);
		--edge-shadow: var(--shadow-elevation-medium);

		--anchor-color: hsl(45, 90%, 67%);
		--anchor-border-color: hsl(45, 90%, 87%);
		--anchor-connected: hsl(45, 90%, 100%);
		--anchor-connected-border: hsl(225, 20%, 20%);

		--anchor-connecting: hsl(225, 30%, 40%);
		--anchor-connecting-border: hsl(0, 0%, 100%);

		--anchor-hovering: hsl(225, 20%, 46%);
		--anchor-hovering-border: hsl(0, 0%, 0%);

		--minimap-background-color: hsl(225, 20%, 27%);

		--minimap-node-color: hsl(225, 30%, 20%);

		--controls-background-color: hsl(225, 20%, 27%);
		--controls-text-color: hsl(0, 0%, 100%);

		--theme-toggle-text-color: hsl(0, 0%, 100%);
		--theme-toggle-color: hsl(225, 20%, 27%);
	}
</style>
