<script lang="ts">
	import { Svelvet, Controls, Minimap } from '$lib';

	const mermaid = `Brian --> Svelvet
	Jen --> Svelvet
	Britta --> Svelvet
	Thomas --> Svelvet
	Svelvet --> Okay`;
</script>

<div class="wrapper">
	<Svelvet theme="dark" {mermaid} width={600} height={600}>
		<!-- <Controls /> -->
		<!-- <Minimap /> -->
	</Svelvet>
</div>

<style>
	.wrapper {
		display: flex;
		justify-content: center;
		margin-top: 20px;
		width: 100%;
		height: 100%;
		display: flex;
	}

	:global(body) {
		background-color: gray;
	}
</style>
