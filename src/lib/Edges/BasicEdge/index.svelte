<script>
	export let x1 = 20,
		y1 = 30;
	export let x2 = 200,
		y2 = 50;

	let moving = false;

	function onMouseDown() {
		moving = true;
	}
	function onMouseUp() {
		moving = false;
	}

	function onMouseMove(e) {
		if (moving) {
			x1 += e.movementX;
			y1 += e.movementY;
		}
	}

	// $: console.log(moving);
</script>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<svg viewBox="0 0 400 400" style="overflow:visible">
	<line {x1} {y1} {x2} {y2} stroke="black" stroke-width="2" />
</svg>

<div class="draggable Handle" style="left:{x1 - 5}px; top:{y1 - 5}px" />
<div class="draggable Handle" style="left:{x2 - 5}px; top:{y2 - 5}px" />
