<script>
	import * as d3 from "d3";
	import { onMount } from "svelte";

	onMount(() => {
		//initZoom();
	})
	
	let zoom = d3.zoom()
	             .on('zoom', handleZoom);  	  

	function handleZoom(e) {
		d3.selectAll('g')
		  .attr('transform', e.transform);
	}

	function initZoom() {
		d3.select('svg')
		  .call(zoom);
	}

</script>

<slot/>
