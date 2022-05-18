<script lang="ts">
	import { onMouseMove } from '$lib/stores/store';

	export let node;
	// $: left = node.position.x;
	// $: top = node.position.y;

	// $: x1 = left + 50;
	// $: y1 = top;
	// $: x2 = left + 50;
	// $: y2 = top + 50;

	$: x1 = node.position.x + 50;
	$: y1 = node.position.y;
	$: x2 = node.position.left + 50;
	$: y2 = node.position.y + 50;

	let moving = false;

	function onMouseDown() {
		moving = true;
	}
	function onMouseUp() {
		moving = false;
	}

	// function onMouseMove(e) {
	// 	if (moving) {
	// 		left += e.movementX;
	// 		top += e.movementY;
	// 		x1 += e.movementX;
	// 		y1 += e.movementY;
	// 		x2 += e.movementX;
	// 		y2 += e.movementY;
	// 	}
	// }

	// $: console.log(moving);
</script>

<svelte:window
	on:mouseup={onMouseUp}
	on:mousemove={(e) => {
		if (moving) onMouseMove(e, node.id);
	}}
/>

<!-- <section on:mousedown={onMouseDown} style="left: {left}px; top: {top}px;" class="draggable"> -->
<section
	on:mousedown={onMouseDown}
	style="left: {node.position.x}px; top: {node.position.y}px;"
	class="draggable"
>
	<slot />
</section>

<div class="Handle" style="left:{x1 - 5}px; top:{y1 - 5}px" />

<div class="Handle" style="left:{x2 - 5}px; top:{y2 - 5}px" />

{node.position.x}
{node.position.y}

<style>
	.draggable {
		background: white;
		user-select: none;
		cursor: move;
		border: solid 1px gray;
		position: absolute;
		border-radius: 10px;
		min-width: 100px;
		min-height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
	}

	.Handle {
		display: block;
		position: absolute;
		width: 8px;
		height: 8px;
		border: solid 1px black;
		background: yellow;
		cursor: move;
		border-radius: 50%;
	}
</style>
