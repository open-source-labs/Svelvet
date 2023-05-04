<script lang="ts">
	import { Node, Svelvet, Anchor, Resizer } from '$lib';
	import Percent from '../example-components/Percent.svelte';

	let itemArr = ['h-40'];
</script>

<div class="wrapper">
	<Svelvet id="my-canvas" TD minimap>
		<Node
			id="alpha"
			bgColor="red"
			dimensions={{ width: 300, height: 400 }}
			position={{ x: 250, y: 100 }}
		>
			<div class="anchor">
				<Anchor nodeConnect let:connecting let:hovering let:linked />
			</div>
			<button on:click={() => (itemArr = [...itemArr, 'h-40'])} class="bg-white">
				Increase height
			</button>
			<div>
				{#each itemArr as div, idx}
					<div class="w-40 h-40 bg-white border">
						<button
							class="border"
							on:click={() => {
								itemArr = itemArr.filter((_, i) => i !== idx);
								itemArr = itemArr;
							}}
						>
							Remove height
						</button>
					</div>
				{/each}
			</div>

			<Resizer width height />
		</Node>
		<Percent />
	</Svelvet>
</div>

<style>
	.wrapper {
		width: 100vw;
		height: 100vh;
		padding: 0;
		margin: 0;
	}

	.anchor {
		position: absolute;
		left: 0px;
		top: 2px;
	}
</style>
