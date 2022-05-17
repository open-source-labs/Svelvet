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

	We set up a store that handles the state objects. Those objects will be created in the nodes and edges components. 
	The objects themselves will have initial coordinates, updated coordinates and all the types and interface data.
	In the store, we have our subscription functionality set up. 
	Everything passed to the store will be updated through the functionality in the store (just like redux) and that way we have access to it within all components
	D3 Functionality will live in the Store as well since D3 is 100% Data driven

	1. create a store file and list out type schemas and the necessary functionalities needed for nodes, edges and zoompane
	2. be sure to map out which variables need to be accessed by which functions and passed in which component 
	3. carefully render components in a way that can test the usability of the Svelvet library once we render Svelvet in the router folder's index.js

	go through node store in react to translate it over to svelte 

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
