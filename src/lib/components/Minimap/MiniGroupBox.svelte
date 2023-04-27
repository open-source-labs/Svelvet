<script lang="ts">
	import type { CSSColorString, Dimensions, XYPair } from '$lib/types';
	import type { Writable } from 'svelte/store';

	export let dimensions: Dimensions;
	export let position: Writable<XYPair>;
	export let color: Writable<CSSColorString>;
	export let groupName: string;

	export let top: number;
	export let left: number;

	const { width, height } = dimensions;
</script>

<div
	class="mini-bounding-box"
	id={`mini-${groupName}-bounding-box`}
	style:top={`${$position.y - top}px`}
	style:left={`${$position.x - left}px`}
	style:width={`${$width}px`}
	style:height={`${$height}px`}
	style="border: solid 4px {$color};"
	style:background-color={$color}
/>

<style>
	.mini-bounding-box {
		position: absolute;
		opacity: 25%;
		z-index: -4;
		pointer-events: none;
		border-radius: 10px;
	}
</style>
