<script lang="ts">
	import ApiEdges from 'src/routes/docs/api-edges.svelte';

	import { onMount } from 'svelte';
	import type { Rect } from '../types/utils';

	export let edgeTextProps: any;

	$: ({
		x, 
		y,
<<<<<<< HEAD
		label
		// labelStyle = {},
		// labelShowBg = false,
		// labelBgStyle = {},
		// labelBgPadding = [2, 4],
		// labelBgBorderRadius = 2,
		// children,
		// className,
		// ...rest
	} = edgeTextProps;
=======
		label,
	} = edgeTextProps);
>>>>>>> main

	let labelLength = 0;
	let textWidth = 0; 

	onMount(() => {
		let labelText = document.querySelectorAll('.EdgeText')
		labelText.forEach(el => {
			if (el.innerHTML === label) {
				textWidth = el.getComputedTextLength();  
			}
		})
		if (textWidth <= 50) labelLength = textWidth * 2; 
		if (textWidth > 50 && textWidth < 60) {
			labelLength = textWidth * 0.5;
		}
		if (textWidth >= 60) {
			textWidth <= 175 ? labelLength = textWidth * -0.2 : labelLength = textWidth * -0.8; 
		}
	});
	
</script>

{#if typeof label === 'undefined' || !label}
	{null}
{:else}
<<<<<<< HEAD
	<g transform={`translate(${x - edgeTextBbox.width / 2} ${y - edgeTextBbox.height / 2})`}>
		<text class="EdgeText" y={edgeTextBbox.height / 2} dy="0.3em" href={edgeRef}>
=======
	<g>
		<rect 
			class="InvisibleBox" 
			fill=white 
			x={x + (labelLength/2)} 
			y={y-15} 
			width = {textWidth} 
			height= {25} 
		> 
		</rect>
		<text
			class="EdgeText"
			x={x + (labelLength/2)}
			y={y}
			dy="0.3em"
		>
>>>>>>> main
			{label}
		</text>
	</g>
{/if}

<style>
	.EdgeText {
		font-size: 16px;
	}	
</style>
