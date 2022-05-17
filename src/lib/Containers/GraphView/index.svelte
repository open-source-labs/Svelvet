<script>
	import * as d3 from "d3";
	import { onMount } from "svelte";

	onMount(() => {
		initZoom();
	})
	
	let zoom = d3.zoom()
  	  .on('zoom', handleZoom);

	function handleZoom(e) {
		d3.select('svg rect')
		  .attr('transform', e.transform);
	}

	function initZoom() {
		d3.select('svg')
		  .call(zoom);
	}

	/*

	object of our state from the store  (+ types object/schema): for nodes & edges
	ZoomPane: all info for behavior and handler for d3

	*/

</script>

<svg viewBox="0 0 500 500">
	<rect x="100" y="100" width="20" height="20">
</svg>

<!-- <div>
	<slot />
</div> -->

<style>
	/* div {
		display: block;
		position: relative;
		width: 400px;
		height: 400px;
		margin: 20px;
		border: solid 1px black;
		overflow: hidden;
	} */
	svg {
		border: solid 1px black;
	}
	/* circle {
		opacity: 0.7;
	} */
</style>
