<script lang="ts">
	import { onMount } from 'svelte';

	// import Rect from types...

	export let edgeTextProps: any;
	const {
		x,
		y,
		label,
		// labelStyle = {},
		// labelShowBg = false,
		// labelBgStyle = {},
		// labelBgPadding = [2, 4],
		// labelBgBorderRadius = 2,
		// children,
		// className,
		// ...rest
	} = edgeTextProps;

	const edgeRef: any = null; //when you set type to SVGTextElement as it was there is a type error, look into later
	let edgeTextBbox: Rect = { x: 0, y: 0, width: 0, height: 0 };

	// onMount(() => {
	// 	if (edgeRef.current) {
	// 		const textBbox = edgeRef.current.getBBox();
	// 		edgeTextBbox = {
	// 			x: textBbox.x,
	// 			y: textBbox.y,
	// 			width: textBbox.width,
	// 			height: textBbox.height
	// 		};
	// 	}
	// }); //the typescript error on this line will be fixed once EdgeTextProps is uncommented
</script>

{#if typeof label === 'undefined' || !label}
	{null}
{:else}
	<g
		transform={`translate(${x - edgeTextBbox.width / 2} ${y - edgeTextBbox.height / 2})`}
	>
		<text
			class="EdgeText"
			y={edgeTextBbox.height / 2}
			dy="0.3em"
			href={edgeRef}
		>
			{label}
		</text>
	</g>
{/if}

<style>
	.EdgeText {
		font-size: 16px;
		fill: white;
	}
</style>
