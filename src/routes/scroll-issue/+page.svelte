<script lang="ts">
	import { Svelvet, Minimap, Node, Anchor, Background } from '$lib';
	import CustomEdge from '../../example-components/CustomEdge.svelte';
	function getPosition() {
		return {
			x: Math.random() * 1000,
			y: Math.random() * 1000
		};
	}
</script>

<body>
	<Svelvet width={800} height={800}>
		<Node
			label="Node 1"
			connections={[2, 3, '4', [5, '1'], 6, ['custom', 'custom'], 27]}
			inputs={0}
			outputs={4}
			position={{ x: 0, y: 0 }}
		/>
		<Node label="Node 2" position={{ x: 400, y: 100 }} />
		<Node label="Node 3" inputs={2} outputs={2} position={{ x: 400, y: 300 }} />
		<Node label="Node 4" inputs={2} outputs={5} position={{ x: 400, y: 500 }} />
		<Node
			label="Node 5"
			connections={[
				['8', 1],
				['custom', 'custom2']
			]}
			inputs={5}
			outputs={2}
			position={{ x: 400, y: 700 }}
		/>
		<Node label="Node 6" position={{ x: 400, y: 900 }} />
		<Node id="custom" position={{ x: -100, y: 300 }} connections={[4, ['3', 4]]}>
			<div class="node">
				<Anchor output id="custom" direction="west" connections={[5, [5, 5]]} />
				<Anchor output id="custom2" direction="west" />
			</div>
		</Node>
		<Node
			position={{ x: 0, y: 600 }}
			connections={[2, 3, '4', [5, '1'], 6, ['custom', 'custom']]}
		/>

		<Background style="dots" majorGrid={4} slot="background" />
	</Svelvet>
</body>

<style>
	body {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: gray;
		width: 2000px;
		height: 2000px;
		padding: 0;
		margin: 0;
	}

	.node {
		width: 300px;
		height: 200px;
		background-color: gray;
	}
</style>
