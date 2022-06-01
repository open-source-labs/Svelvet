<script lang="ts">
	export let edgeTextProps;

	$: ({ sourceX, sourceY, targetX, targetY, label } = edgeTextProps); 

	const shiftRectY = 7;
	$: pxRatio = label.length < 3 ? 9 : 7;

	$: textCenterX = sourceX + (targetX - sourceX)/2;
	$: textCenterY = sourceY + (targetY - sourceY)/2;

	// determine width of rect to render based on label.length (removing spaces)
		// pxRatio is an estimate of how many pixels 1 character might take up 
		// pxRatio not 100% accurate as font is not monospace
	$: spaces = label.split(' ').length - 1; 
	$: newLength = label.length - spaces;
	$: labelPx = newLength * pxRatio;

</script>

{#if typeof label === 'undefined' || !label}
	{null}
{:else}
	<g>
		<rect
			class="EdgeTextBg"
			fill="white"
			x={textCenterX - labelPx/2}
			y={textCenterY - shiftRectY}
			width={labelPx}
			height={16}	
		/>
		<text class="EdgeText" 
			x={textCenterX}
			y={textCenterY}
			font-size="12px"
			dominant-baseline="central" 
			text-anchor="middle"
			style="fill:black"
		>
			{label}
		</text>
	</g>
{/if}