<script lang="ts">
	// This is used to test the custom component import functionality
	export let heading: string;
	export let paragraph: string;

	function onClick() {
		alert('Hello World!');
	}
</script>

<div>
	<h1>{heading}</h1>
	<p>{paragraph}</p>
	<button on:click={onClick}>Click Me</button>
	<div id="anchor-1" />
</div>

<style>
	div {
		width: 600px;
		height: 300px;
		background-color: rgb(99, 183, 219);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 4rem;
	}

	#anchor-1 {
		width: 50px;
		height: 50px;
		background-color: rgb(177, 62, 62);
	}
</style>
