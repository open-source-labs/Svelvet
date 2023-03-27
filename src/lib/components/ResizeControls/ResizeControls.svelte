<script lang="ts">
	export let nodeKey;

	export let resize = () => {};
	import { onMount } from 'svelte';

	let resizeWrapoper;
</script>

<div class="resize-wrapper" />

<style>
	.resize-wrapper {
		box-sizing: border-box;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		pointer-events: none;
		border-radius: 8px;
		border: solid 2px rgb(207, 248, 250);
	}
</style>
