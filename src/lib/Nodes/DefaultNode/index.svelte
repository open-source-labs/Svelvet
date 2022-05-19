<script> 
	export let node;
	import { onMouseMove } from '$lib/stores/store';
	
	let moving = false;

	function onMouseDown() {
		moving = true;
	}
	function onMouseUp() {
		moving = false;
	}	
</script>

<svelte:window on:mouseup={onMouseUp} on:mousemove={(e) => { 
	if (moving) onMouseMove(e, node.id);
}
} />

<div on:mousedown={onMouseDown} class="Node" style="left: {node.position.x}px; top: {node.position.y}px; width: {node.width}px; height: {node.height}px; background-color: {node.bgColor}; font-size:24px;">
	<slot/>
</div>
	
<style>
	.Node {
	    position: absolute;
		display: grid;
		user-select: none;
		cursor: move;
		justify-content: center;
		align-items: center;
		text-align: center;
		border: solid 1px gray;
		border-radius: 10px;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
	}
</style>