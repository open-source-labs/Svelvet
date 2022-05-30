<script lang="ts">
	export let x;
	export let y;
</script>

<circle 
	cx={x} 
	cy={y} 
	r={5} 
	stroke="white" 
	fill="black" 
/>

<style>
	circle {
		position: absolute;
	}
</style>
