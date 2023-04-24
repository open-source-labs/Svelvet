<script lang="ts">
	import { Anchor, Node } from '$lib';

	let title = '';
	let description = '';
</script>

<Node bgColor="black" label="StartNode" borderRadius={10}>
	<div class="node">
		<input
			class="input-pointer"
			bind:value={title}
			title="Story Title"
			placeholder="Story Title"
			type="text"
		/>
		<input
			class="input-pointer"
			bind:value={description}
			title="Story Description"
			placeholder="Story Description"
			type="text"
		/>
		<input class="checkbox" type="checkbox" />

		<button on:click={() => alert('Test')}>Test</button>
		<Anchor output direction="east" />
	</div>
</Node>

<style>
	.node {
		width: 400px;
		height: 400px;
	}
</style>
