<script context="module" lang="ts">
	import arrow_left from '$lib/assets/icons/arrow_left.svelte';
	import arrow_right from '$lib/assets/icons/arrow_right.svelte';
	import dark_mode from '$lib/assets/icons/dark_mode.svelte';
	import light_mode from '$lib/assets/icons/light_mode.svelte';
	import filter_center_focus from '$lib/assets/icons/filter_center_focus.svelte';
	import lock from '$lib/assets/icons/lock.svelte';
	import lock_open from '$lib/assets/icons/lock_open.svelte';
	import north_west from '$lib/assets/icons/north_west.svelte';
	import south_east from '$lib/assets/icons/south_east.svelte';
	import zoom_in from '$lib/assets/icons/zoom_in.svelte';
	import zoom_out from '$lib/assets/icons/zoom_out.svelte';
	import visibility_off from '$lib/assets/icons/visibility_off.svelte';
</script>

<script lang="ts">
	export let width = 16;
	export let icon: keyof typeof icons;

	const icons = {
		arrow_left,
		arrow_right,
		dark_mode,
		light_mode,
		filter_center_focus,
		lock,
		lock_open,
		north_west,
		south_east,
		zoom_in,
		zoom_out,
		visibility_off
	};
</script>

<svg xmlns="http://www.w3.org/2000/svg" height={width} viewBox="0 -960 960 960" {width}>
	<svelte:component this={icons[icon]} />
</svg>

<style>
	svg {
		fill: currentColor;
	}
</style>
