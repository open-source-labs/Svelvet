<script lang="ts">
	// import { onMount } from 'svelte';

	export let edgeTextProps: any;

	$: ({ sourceX, sourceY, targetX, targetY, label } = edgeTextProps); 

	// let labelLength = 0;
	// let textWidth = 0;
	// let labelText;

	onMount(() => {
		// labelText = document.querySelectorAll('.EdgeText');
		// labelText.forEach((el) => {
		// 	if (el.innerHTML === label) {
		// 		textWidth = el.getComputedTextLength();
		// 	}
		// });
		// if (textWidth <= 50) labelLength = textWidth * 2;
		// if (textWidth > 50 && textWidth < 60) {
		// 	labelLength = textWidth * 0.5;
		// }
		// if (textWidth >= 60) {
		// 	textWidth <= 175 ? (labelLength = textWidth * -0.2) : (labelLength = textWidth * -0.8);
		// }
	});

</script>

{#if typeof label === 'undefined' || !label}
	{null}

{:else}
	<g>
		<!-- <rect
			class="InvisibleBox"
			fill="white"
			x={x + labelLength / 2}
			y={y - 15}
			width={textWidth}
			height={25}
		/>
		<text class="EdgeText" 
			x={x + labelLength / 2} 
			y={y} 
			dy="0.3em"
		>
			{label}
		</text> -->
		
		<text class="EdgeText" 
			x={sourceX + (targetX - sourceX)/2}
			y={sourceY + (targetY - sourceY)/2}
			dominant-baseline="central" 
			text-anchor="middle"
			fill="white"
			style="stroke:white; stroke-width:0.3em; stroke-linejoin:round;"
		>
			{label}
		</text>
		<!-- <rect
			class="InvisibleBox"
			fill="white"
			x={sourceX + (targetX - sourceX)/2 - (label.length*7)/2}
			y={sourceY + (targetY - sourceY)/2 - 6}
			width={label.length * 7}
			height={15}
		/> -->
		<text class="EdgeText" 
			x={sourceX + (targetX - sourceX)/2}
			y={sourceY + (targetY - sourceY)/2}
			font-size="14px"
			dominant-baseline="central" 
			text-anchor="middle"
			style="fill:black"
		>
			{label}
		</text>
	</g>
{/if}