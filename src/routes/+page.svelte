<script lang="ts">
	import { Svelvet, Controls, Minimap, Node } from '$lib';

	const mermaid = `Brian --> Svelvet
	Jen --> Svelvet
	Britta --> Svelvet
	Thomas|Geometry|musgraveConfig --> Svelvet
	Svelvet --> Kevin
	Kevin --> Whatever`;
</script>

<div class="wrapper">
	<Svelvet theme="light" {mermaid} width={600} height={600}>
		<!-- <Controls  /> -->
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
