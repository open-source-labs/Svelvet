<script lang="ts">
	import SpecialNode from '$lib/components/Node/Node.svelte';
	import Anchor from '$lib/components/Anchor/Anchor.svelte';
	import Resizer from '$lib/components/Resizer/Resizer.svelte';
</script>

<SpecialNode let:grabHandle let:selected width={400} height={600}>
	<div class="node" use:grabHandle class:selected>
		Hello
		<Anchor let:hovering let:linked multiple>
			<div class="custom" class:hovering class:linked />
		</Anchor>
		<Anchor />
		<Anchor />
	</div>

	<Resizer width height minWidth={200} minHeight={200} />
</SpecialNode>

<style>
	p {
		color: white;
	}
	.custom {
		width: 20px;
		height: 20px;
		background-color: red;
	}
	.hovering {
		background-color: green;
	}
	.linked {
		background-color: blue;
	}
	.node {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		border: solid 3px pink;
		border-radius: 50%;
		position: relative;
		pointer-events: auto;
		display: flex;
		flex-direction: column;
		padding: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.handle {
		width: 100%;
		position: relative;
		left: -40px;
		height: 40px;
		border-radius: 10px;
		width: 50px;
		top: -80px;
		background-color: red;
	}
	.selected {
		background-color: rgb(218, 47, 201);
	}
	.input-anchors {
		position: absolute;
		top: -29px;
		display: flex;
		gap: 10px;
		margin-right: 10x;
	}

	.output-anchors {
		position: absolute;
		right: -20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-right: 10x;
	}
</style>
