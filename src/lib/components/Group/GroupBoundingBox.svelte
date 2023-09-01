<script lang="ts">
	import type { CSSColorString, Dimensions, XYPair } from '$lib/types';
	import type { Writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';

	export let dimensions: Dimensions;
	export let position: Writable<XYPair>;
	export let color: Writable<CSSColorString>;
	export let groupName: string;
	export let locked: Writable<boolean>;

	const { width, height } = dimensions;

	$: id = `${groupName}-bounding-box`;

	const dispatch = createEventDispatcher();

	function dispatchClick() {
		dispatch('groupClick', { groupName });
	}
</script>

<div
	role="button"
	tabindex="0"
	on:contextmenu|stopPropagation|preventDefault
	on:mousedown|stopPropagation|preventDefault={() => {
		!$locked && dispatchClick();
	}}
	class="bounding-box-border"
	class:locked={$locked}
	{id}
	style:top={`${$position.y}px`}
	style:left={`${$position.x}px`}
	style:width={`${$width}px`}
	style:height={`${$height}px`}
	style="border: 4px solid {$color};"
>
	<div class="bounding-box" style:background-color={$color} />
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
		z-index: -4;
		pointer-events: auto;
	}
	.locked {
		pointer-events: none !important;
	}
</style>
