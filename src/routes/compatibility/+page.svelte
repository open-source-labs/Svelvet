<script lang="ts">
	import { Svelvet, Minimap, Node, Anchor } from '$lib';
	import CustomEdge from '../../example-components/CustomEdge.svelte';
	import ColorAnchor from '../../example-components/sandbox/ColorAnchor.svelte';

	const nodes: number = 3;
</script>

<body>
	<Svelvet fitView>
		{#each Array(nodes) as _, i}
			<Node label={`Node ${i + 1}`} position={{ x: 200 * i, y: 200 * i }} TD>
				<div class="node">
					<div class="inputs">
						<Anchor input dataType={'image'} let:hovering>
							<div class="my-anchor red" class:hovering />
						</Anchor>
						<Anchor input dataType={['image', 'tabular']} let:hovering>
							<div class="my-anchor redblue" class:hovering />
						</Anchor>
						<Anchor input dataType={'tabular'} let:hovering>
							<div class="my-anchor blue" class:hovering />
						</Anchor>
					</div>
					<div class="outputs">
						<Anchor output dataType={'tabular'} let:hovering>
							<div class="my-anchor blue" class:hovering />
						</Anchor>

						<Anchor output dataType={'image'} let:hovering>
							<div class="my-anchor red" class:hovering />
						</Anchor>
					</div>
				</div>
			</Node>
		{/each}
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
		padding: 0;
		margin: 0;
	}

	.node {
		width: 200px;
		height: 100px;
		background-color: #fafafa;
		position: relative;
	}
	.node .inputs {
		position: absolute;
		top: 5%;
		left: -10px;
		height: 90%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.node .outputs {
		position: absolute;
		top: 5%;
		right: 0;
		height: 90%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.my-anchor {
		width: 18px;
		height: 18px;
		border-radius: 50%;
	}
	.my-anchor.hovering {
		transform: scale(1.2);
	}
	.my-anchor.red {
		background-color: #ef5350;
	}
	.my-anchor.blue {
		background-color: #42a5f5;
	}
	.my-anchor.redblue {
		background: linear-gradient(90deg, rgba(239, 83, 80, 1) 0%, rgba(66, 165, 245, 1) 100%);
	}
</style>
