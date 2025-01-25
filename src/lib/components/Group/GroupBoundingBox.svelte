<script lang="ts">
	import { createBubbler, preventDefault, stopPropagation } from 'svelte/legacy';

	const bubble = createBubbler();
	import type { CSSColorString, Dimensions, XYPair } from '$lib/types';
	import type { Writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';

	interface Props {
		dimensions: Dimensions;
		position: Writable<XYPair>;
		color: Writable<CSSColorString>;
		groupName: string;
	}

	let {
		dimensions,
		position,
		color,
		groupName
	}: Props = $props();

	const { width, height } = dimensions;

	let id = $derived(`${groupName}-bounding-box`);

	const dispatch = createEventDispatcher();

	function dispatchClick() {
		dispatch('groupClick', { groupName });
	}
</script>

<div
	role="button"
	tabindex="0"
	oncontextmenu={stopPropagation(preventDefault(bubble('contextmenu')))}
	onmousedown={stopPropagation(preventDefault(dispatchClick))}
	class="bounding-box-border"
	{id}
	style:top={`${$position.y}px`}
	style:left={`${$position.x}px`}
	style:width={`${$width}px`}
	style:height={`${$height}px`}
	style="border: solid 4px {$color};"
>
	<div class="bounding-box" style:background-color={$color}></div>
</div>

<style>
	.bounding-box {
		width: 100%;
		height: 100%;
		opacity: 25%;
		z-index: -4;
		pointer-events: none;
	}
	.bounding-box-border {
		position: absolute;
		overflow: hidden;
		border-radius: 10px;
		pointer-events: auto;
		z-index: -4;
	}
</style>
