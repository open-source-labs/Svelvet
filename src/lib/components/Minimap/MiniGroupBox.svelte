<script lang="ts">
	import type { CSSColorString, Dimensions, XYPair } from '$lib/types';
	import type { Writable } from 'svelte/store';


	interface Props {
		dimensions: Dimensions;
		position: Writable<XYPair>;
		color: Writable<CSSColorString>;
		groupName: string;
		top: number;
		left: number;
	}

	let {
		dimensions,
		position,
		color,
		groupName,
		top,
		left
	}: Props = $props();

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
></div>

<style>
	.mini-bounding-box {
		position: absolute;
		opacity: 25%;
		z-index: -4;
		pointer-events: none;
		border-radius: 10px;
	}
</style>
