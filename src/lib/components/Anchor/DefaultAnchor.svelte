<script lang="ts">
	import type { CSSColorString } from '$lib/types';

	export let output: boolean;
	export let input: boolean;
	export let connecting: boolean;
	export let connected: boolean;
	export let hovering: boolean;
	export let bgColor: CSSColorString | null;
</script>

<div
	class="svelvet-anchor"
	class:output
	class:input
	class:connected
	class:connecting
	class:hovering
	style:--prop-anchor-color={bgColor}
/>

<style>
	* {
		box-sizing: border-box;
	}

	.svelvet-anchor {
		width: var(--anchor-width, var(--default-anchor-size));
		height: var(--anchor-height, var(--default-anchor-size));
		border-radius: var(--anchor-radius, var(--default-anchor-radius));
		background-color: var(--prop-anchor-color, var(--anchor-color, var(--default-anchor-color)));
		z-index: 12;
		cursor: pointer;
		box-shadow: 0 0 0px 1px var(--anchor-border-color, var(--default-anchor-border-color));
		pointer-events: auto;
	}

	.connecting {
		background-color: var(--anchor-connecting, var(--default-anchor-connecting));
		box-shadow: 0 0 0px 1px var(--anchor-connecting-border, var(--default-anchor-connecting-border));
	}

	.hovering {
		background-color: var(--anchor-hovering, var(--default-anchor-hovering));
		box-shadow: 0 0 0px 1px var(--anchor-hovering-border, var(--default-anchor-hovering-border));
	}

	.connected {
		background-color: var(--anchor-connected, var(--default-anchor-connected));
		box-shadow: 0 0 0px 1px var(--anchor-connected-border, var(--default-anchor-connected-border));
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
