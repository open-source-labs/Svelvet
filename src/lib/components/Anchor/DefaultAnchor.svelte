<script lang="ts">
	import { ANCHOR_SIZE, ANCHOR_RADIUS } from '$lib/constants';
	import type { CSSColorString, ThemeGroup } from '$lib/types';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let output: boolean;
	export let input: boolean;
	export let connecting: boolean;
	export let connected: boolean;
	export let hovering: boolean;
	export let bgColor: CSSColorString | null;

	const themeStore = getContext<Writable<ThemeGroup>>('themeStore');
</script>

<div
	class="svelvet-anchor"
	class:output
	class:input
	class:connected
	class:connecting
	class:hovering
	style:--default-width={`${ANCHOR_SIZE}px`}
	style:background-color={bgColor || $themeStore.anchor}
	style:--default-radius={ANCHOR_RADIUS}
/>

<style>
	* {
		box-sizing: border-box;
	}

	.svelvet-anchor {
		width: var(--anchor-size, var(--default-width));
		height: var(--anchor-size, var(--default-width));
		z-index: 12;
		border-radius: var(--anchor-radius, var(--default-radius));
		background-color: var(--anchor-color, var(--default-color));
		cursor: pointer;
		border: solid 1px black;
		pointer-events: auto;
	}
	.output {
		border-color: white;
	}
	.input {
		border-color: rgb(255, 255, 255);
	}

	div {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
	}
</style>
