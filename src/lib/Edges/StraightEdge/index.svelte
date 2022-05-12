<script>
	import { draggable } from 'svelte-agnostic-draggable';

	let x1 = 20,
		y1 = 30;
	let x2 = 200,
		y2 = 50;

	/**** map all touch events to mouse events ****/

	// import mapTouchToMouseFor from 'svelte-touch-to-mouse';
	// mapTouchToMouseFor('.draggable');

	/**** Svelte Event Handling ****/

	function onDragMove_1(Event) {
		x1 = Event.detail.position.left + 5;
		y1 = Event.detail.position.top + 5;
	}

	function onDragMove_2(Event) {
		x2 = Event.detail.position.left + 5;
		y2 = Event.detail.position.top + 5;
	}
</script>

<!-- <p style="line-height:150%">Drag any line node around:</p> -->

<!-- <div
	style="
    display:block; position:relative;
    width:400px; height:400px;
    margin:20px;
    border:solid 1px black; z-index:-1;
  "
> -->
<svg viewBox="0 0 400 400" style="overflow:visible">
	<line {x1} {y1} {x2} {y2} stroke="black" stroke-width="2" />
</svg>

<div
	class="draggable Handle"
	style="left:{x1 - 5}px; top:{y1 - 5}px"
	use:draggable={{ helper: 'clone', containment: 'parent' }}
	on:drag:move={onDragMove_1}
/>
<div
	class="draggable Handle"
	style="left:{x2 - 5}px; top:{y2 - 5}px"
	use:draggable={{ helper: 'clone', containment: 'parent' }}
	on:drag:move={onDragMove_2}
/>

<!-- </div> -->
<style>
	.draggable {
		-webkit-touch-callout: none;
		-ms-touch-action: none;
		touch-action: none;
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.Handle {
		display: block;
		position: absolute;
		width: 8px;
		height: 8px;
		border: solid 1px black;
		background: yellow;
		cursor: move;
	}

	.Handle:global(.ui-draggable-helper) {
		visibility: hidden;
	}
</style>
