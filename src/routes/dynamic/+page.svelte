<script lang="ts">
	import { Svelvet, Minimap, Node } from '$lib';
	import Anchor from '$lib/components/Anchor/Anchor.svelte';
	let outputs = 4;
</script>

<body>
	<div class="wrapper">
		<Svelvet width={600} height={900} theme="purple" controls>
			<!-- <Node
				position={{ x: 200, y: 800 }}
				{outputs}
				id="dynamic"
				label="Dynamic 1"
				resizable
				dynamic
				connections={[2, 3, 4, 2, 3, 2]}
			/>
			<Node connections={[1, 3]} position={{ x: 500, y: 400 }} label="Static" />
			<Node useDefaults width={200} height={100} connections={[1, 3, 4, 4]}>
				<Anchor dynamic />
				<h1>Half</h1>
				<div class="anchor">
					<Anchor direction="west" />
				</div>
			</Node>
			<Node
				label="Dynamic"
				connections={[1, 2]}
				position={{ x: 10, y: 200 }}
				inputs={3}
				dynamic
				TD
			/>
			<Node bgColor="transparent" connections={[6]} dynamic />
			<Node bgColor="transparent" />
			<Node bgColor="transparent" connections={[[8, 2]]} TD />
			<Node bgColor="transparent" LR /> -->
			<Node dynamic />
			<Node dynamic />
		</Svelvet>
	</div>
</body>

<style>
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
		padding: 0;
		margin: 0;
	}
</style>
