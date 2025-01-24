<script lang="ts">
	import { Svelvet, Node, Anchor } from '$lib';
	import { getSnappedPosition } from '$lib/utils/snapGrid';
	import { onMount, onDestroy } from 'svelte';

	let position = { x: 300, y: 300 };
	$: console.log(position);
	let isDragging = false;
	let offsetX = 0;
	let offsetY = 0;

	function startDrag(event: MouseEvent) {
		isDragging = true;
		offsetX = event.clientX - position.x;
		offsetY = event.clientY - position.y;
	}
	// During drag: update the position based on mouse movement
	function drag(event: MouseEvent) {
		if (isDragging) {
			const snappedPosition = getSnappedPosition(event.clientX - offsetX, event.clientY - offsetY);
			position = { x: snappedPosition.x, y: snappedPosition.y };
		}
	}

	// End dragging: stop dragging and reset flags
	function stopDrag() {
		isDragging = false;
		// document.removeEventListener('mousemove', drag);
		// document.removeEventListener('mouseup', stopDrag);
	}

	// onMount(() => {
	// 	document.addEventListener('mousemove', drag);
	// 	document.addEventListener('mouseup', stopDrag);
	// 	// document.addEventListener('mousemove', (event) => drag(event as MouseEvent));
	// 	// document.addEventListener('mouseup', stopDrag);
	// });

	// onDestroy(() => {
	// 	document.removeEventListener('mousemove', drag);
	// 	document.removeEventListener('mouseup', stopDrag);
	// 	// document.removeEventListener('mousemove', (event) => drag(event as MouseEvent));
	// 	// document.removeEventListener('mouseup', stopDrag);
	// });
	window.addEventListener('mousemove', drag);
	window.addEventListener('mouseup', stopDrag);
	window.addEventListener('mouseleave', stopDrag);
</script>

<body>
	<Svelvet minimap title="test">
		<Node bgColor="red" inputs={4} bind:position>
			<div class="node-body">
				<p>{JSON.stringify(position)}</p>
				<button
					on:click={() => {
						position = { x: 200, y: 100 };
					}}>Move</button
				>
			</div>
		</Node>
	</Svelvet>
</body>

<style>
	.node-body {
		width: 200px;
		height: 300px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		cursor: grab;
	}

	.node-body:active {
		cursor: grabbing;
	}

	body {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
	}
</style>
