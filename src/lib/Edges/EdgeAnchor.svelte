<script lang="ts">
	export let x: number;
	export let y: number;
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