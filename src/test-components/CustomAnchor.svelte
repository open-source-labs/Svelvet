<script lang="ts">
	export let linked: boolean = false;
</script>

<div class:linked class="my-anchor" />

<style>
	.my-anchor {
		width: 12px;
		height: 12px;
		background-color: orange;
	}
	.linked {
		width: 12px;
		height: 12px;
		background-color: green;
	}
</style>
