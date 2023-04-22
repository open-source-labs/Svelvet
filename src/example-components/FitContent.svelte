<script lang="ts">
	import { Node } from '$lib';
</script>

<Node>
	<div class="node">
		<div class="content-wrapper">
			<h1>Fit Content</h1>
		</div>
	</div>
</Node>

<style>
	.node {
		width: fit-content;
		height: fit-content;
		background-color: red;
	}
	.content-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 150px;
		height: 600px;
	}
</style>
