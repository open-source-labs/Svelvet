<script lang="ts">
	import { Svelvet, Group, ThemeToggle } from '$lib';
	import DashCount from '../../example-components/test-components/DashCount.svelte';
	import CircleColor from '../../example-components/test-components/CircleColor.svelte';
	import Noise from '../../example-components/test-components/Noise.svelte';
	import Thickness from '../../example-components/test-components/Thickness.svelte';
	import Scale from '../../example-components/test-components/Scale.svelte';
	import Output from '../../example-components/test-components/Output.svelte';
	let theme: import('$lib/types').Theme = 'light';
	let zoom = 0.6;
	let minimapVisible = true;

	const arr = [Thickness, Noise, Scale, CircleColor, DashCount];
</script>

<div class="diagram">
	<Svelvet fitView="resize" edgeStyle="step" TD {theme} {zoom} controls minimap={minimapVisible}>
		{#each arr as node}
			<svelte:component this={node} />
		{/each}
		<button
			style="pointer-events: auto;"
			on:click={() => {
				const tmp = arr[0];
				arr[0] = arr[1];
				arr[1] = tmp;
			}}
		>
			Swap elements
		</button>
		<Output />
		<span id="state" class="note"> Stateful Anchors</span>
		<span id="groups" class="note">Group Boxes</span>
		<ThemeToggle slot="toggle" />
	</Svelvet>
</div>

<style>
	.diagram {
		width: 40vw;
		height: 25vw;
	}
	.note {
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
