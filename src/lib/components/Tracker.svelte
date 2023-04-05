<script>
	import { onMount, onDestroy } from 'svelte';

	let trackedElement;
	let animationFrameId;

	const trackPosition = () => {
		const position = trackedElement.getBoundingClientRect();
		console.log('Position:', position);

		// Call trackPosition again on the next frame
		animationFrameId = requestAnimationFrame(trackPosition);
	};

	onMount(() => {
		// Start tracking the position
		animationFrameId = requestAnimationFrame(trackPosition);
	});

	onDestroy(() => {
		// Cancel the requestAnimationFrame loop when the component is destroyed
		cancelAnimationFrame(animationFrameId);
	});
</script>

<div bind:this={trackedElement}>Tracked Element</div>
