<script>
	export let node;
	import { onMouseMove, nodeSelected } from '$lib/stores/store';

	let moving = false;

	function onMouseDown() {
		moving = true;
		$nodeSelected = true;
	}

	function onMouseUp() {
		moving = false;
		$nodeSelected = false;
	}
</script>

<svelte:window
	on:mouseup={onMouseUp}
	on:mousemove={(e) => {
		if (moving) onMouseMove(e, node.id);
	}}
/>

<div
	on:mousedown={onMouseDown}
	class='Node'
	style=
		"left: {node.position.x}px; 
		top: {node.position.y}px; 
		width: {node.width}px; 
		height: {node.height}px; 
		background-color: {node.bgColor}; 
		border-color: {node.borderColor}; 
		color: {node.textColor};"
>
	<slot />
</div>

<style>
	.Node {
		position: absolute;
		display: grid;
		user-select: none;
		cursor: move;
		justify-content: center;
		overscroll-behavior: auto;
		align-items: center;
		font-size: 14px;
		text-align: center;
		border: solid 1px black;
		border-radius: 5px;
		box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.2);
	}
</style>
