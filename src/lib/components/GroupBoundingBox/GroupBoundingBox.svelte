<script lang="ts">
	import type { CSSColorString, Dimensions, XYPosition } from '$lib/types';
	import type { Writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';

	export let dimensions: Dimensions;
	export let position: XYPosition;
	export let color: Writable<CSSColorString>;
	export let groupName: string;

	const { width, height } = dimensions;
	const { x, y } = position;

	$: top = $y;
	$: left = $x;

	$: id = `${groupName}-bounding-box`;

	const dispatch = createEventDispatcher();

	function dispatchClick() {
		dispatch('groupClick', { groupName });
	}
</script>

<div
	on:contextmenu|stopPropagation|preventDefault={() => console.log('clickeddd')}
	on:mousedown|stopPropagation|preventDefault={dispatchClick}
	class="bounding-box-border"
	{id}
	style:top={`${top}px`}
	style:left={`${left}px`}
	style:width={`${$width}px`}
	style:height={`${$height}px`}
	style="border: solid 4px {$color};"
>
	<div class="bounding-box" style:background-color={$color}>
		<h4>{groupName}</h4>
	</div>
</div>

<style>
	.bounding-box {
		width: 100%;
		height: 100%;
		opacity: 25%;
		z-index: -2;
	}
	.bounding-box-border {
		position: absolute;
		overflow: hidden;
		border-radius: 10px;
	}
</style>
