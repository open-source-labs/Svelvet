<script lang="ts">
	import { Svelvet, Node } from '$lib';
</script>

<body>
	<div class="wrapper">
		<Svelvet width={800} height={500} theme="dark">
			{#each { length: 50 } as _, i}
				<Node
					inputs={0}
					outputs={0}
					label={`Node ${i}`}
					position={{ x: Math.random() * 2000, y: Math.random() * 1000 }}
				/>
			{/each}
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
	}
</style>
