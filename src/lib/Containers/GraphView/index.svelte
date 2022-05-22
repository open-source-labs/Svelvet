<script>
	import * as d3 from "d3";
	import { onMount } from "svelte";

	// look into how to use D3 with HTML elements 
	// look into Canva 

	onMount(() => {
		initZoom();
	})
	
	let zoom = d3.zoom()
	             .on('zoom', handleZoom);  	

	function handleZoom(e) {
		d3.select('.Graph')
		  .style('transform', e.transform);
		// d3.select('path')
		//   .attr('transform', e.transform);
	}

	function initZoom() {
		d3.select('.Graph').call(zoom);
		// d3.select('svg')
		//   .call(zoom);
	}

	// works for svg/edges only (wrap GraphView around svg/edges in Svelvet/index)

	// import * as d3 from "d3";
	// import { onMount } from "svelte";

	// onMount(() => {
	// 	initZoom();
	// })
	
	// let zoom = d3.zoom()
	//              .on('zoom', handleZoom);  	  

	// function handleZoom(e) {
	// 	d3.selectAll('g')
	// 	  .attr('transform', e.transform);
	// }

	// function initZoom() {
	// 	d3.select('svg')
	// 	  .call(zoom);
	// }

</script>

<slot/>
