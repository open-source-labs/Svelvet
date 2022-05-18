<script lang="ts">
	export let node;
	let left = node.position.x;
	let top = node.position.y;

	let x1 = left + 50;
	let y1 = top;
	let x2 = left + 50;
	let y2 = top + 50;

	let moving = false;

	function onMouseDown() {
		moving = true;
	}
	function onMouseUp() {
		moving = false;
	}

	function onMouseMove(e) {
		if (moving) {
			left += e.movementX;
			top += e.movementY;
			x1 += e.movementX;
			y1 += e.movementY;
			x2 += e.movementX;
			y2 += e.movementY;
		}
	}

	// $: console.log(moving);
</script>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<section on:mousedown={onMouseDown} style="left: {left}px; top: {top}px;" class="draggable">
	<slot />
</section>

<div class="Handle" style="left:{x1 - 5}px; top:{y1 - 5}px" />

<div class="Handle" style="left:{x2 - 5}px; top:{y2 - 5}px" />

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
