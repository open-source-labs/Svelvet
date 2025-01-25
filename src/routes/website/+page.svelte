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
	<Svelvet edgeStyle="step" TD {theme} {zoom} controls minimap={minimapVisible} fitView="resize">
		<Group
			position={{ x: -150, y: -100 }}
			width={600}
			height={700}
			color="goldenrod"
			groupName="parameters"
		>
			<Thickness />
			<Noise />
			<Scale />
			<CircleColor />
			<DashCount />
		</Group>
		<Output />
		<span id="state" class="note"> Stateful Anchors</span>
		<span id="groups" class="note">Group Boxes</span>
		{#snippet toggle()}
				<ThemeToggle main="light" alt="dark"  />
			{/snippet}
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
