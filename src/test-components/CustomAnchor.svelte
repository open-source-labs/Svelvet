<script lang="ts">
	export let connected: boolean = false;
</script>

<div class:connected class="my-anchor" />

<style>
	.my-anchor {
		width: 12px;
		height: 12px;
		background-color: orange;
	}
	.connected {
		width: 12px;
		height: 12px;
		background-color: green;
	}
</style>
