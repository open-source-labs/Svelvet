<script lang="ts">
	import { Svelvet, ThemeToggle, Group } from '$lib';
	import Thickness from '../../example-components/sandbox/Thickness.svelte';
	import Noise from '../../example-components/sandbox/Noise.svelte';
	import Scale from '../../example-components/sandbox/Scale.svelte';
	import CircleColor from '../../example-components/sandbox/CircleColor.svelte';
	import DashCount from '../../example-components/sandbox/DashCount.svelte';
	import Output from '../../example-components/sandbox/Output.svelte';

	let zoom = 0.5;
</script>

<body>
	<Svelvet edgeStyle="step" TD {zoom} minimap controls>
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
		<ThemeToggle main="dark" alt="light" slot="toggle" />
	</Svelvet>
</body>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Reenie+Beanie&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=Rubik&display=swap');
	body {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: gray;
		width: 100vw;
		height: 100vh;
		padding: 0;
		margin: 0;
	}
	.note {
		font-family: 'Reenie Beanie', sans-serif;
		position: absolute;
		color: inherit;
		width: 400px;
		transform: rotate(-3deg);
		font-weight: 200px;
		font-size: 40px;
	}
	#state {
		top: -30px;
		left: 620px;
	}
	#groups {
		top: 530px;
		left: 490px;
	}
</style>
