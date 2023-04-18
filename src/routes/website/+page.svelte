<script lang="ts">
	import { Svelvet, type Theme } from '$lib';
	import { ThemeToggle, Group } from '$lib';
	import Thickness from '../../test-components/Thickness.svelte';
	import Output from '../../test-components/Output.svelte';
	import NumCircles from '../../test-components/NumCircles.svelte';
	import CircleColor from '../../test-components/CircleColor.svelte';
	import DashLength from '../../test-components/DashLength.svelte';
	import Noise from '../../test-components/Noise.svelte';
	let theme: Theme = 'dark';
	let zoom = 0.6;
	let width: number;
	// $: zoom = width / 1200;
</script>

<!-- <svelte:window bind:innerWidth={width} /> -->
<body>
	<div class="wrapper">
		<Svelvet edgeStyle="step" TD width={800} {theme} height={500} {zoom} minimap controls>
			<Group
				position={{ x: -150, y: -100 }}
				width={600}
				height={700}
				color="goldenrod"
				groupName="parameters"
			>
				<Thickness />
				<Noise />
				<NumCircles />
				<CircleColor />
				<DashLength />
			</Group>
			<Output />
			<span id="state" class="note"> Stateful Anchors</span>
			<span id="groups" class="note">Group Boxes</span>
			<ThemeToggle main="dark" alt="light" slot="toggle" />
		</Svelvet>
	</div>
</body>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Reenie+Beanie&display=swap');
	.wrapper {
		display: flex;
		border: solid 1px black;
		border-radius: 20px;
		overflow: hidden;
		box-shadow: 0 0 40px 0 rgba(37, 37, 37, 0.5);
	}
	body {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: gray;
		width: 100vw;
		height: 100vh;
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
