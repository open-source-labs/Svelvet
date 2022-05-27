<script lang="ts">
	import { onMount } from 'svelte';

	export let edgeTextProps: any;

	$: ({
		x, 
		y,
		label,
	} = edgeTextProps);

	let labelLength = 0;
	let labelWidth = 0; 

		onMount(() => {
			let labelText = document.querySelectorAll('.EdgeText')
			console.log(labelText);
			labelText.forEach(el => {
				if (el.innerHTML === label) {
					labelLength = el.getComputedTextLength();
					labelWidth = labelLength; 
					if(labelLength > 50){
						if(labelLength < 100){
							labelLength = labelLength *-.2;
						}
						else{
							labelLength = labelLength*-1;
						}
					}
					console.log(labelLength);
				}
			})
		});
	
</script>

{#if typeof label === 'undefined' || !label}
	{null}
{:else}
	<g>
		<rect 
			class="InvisibleBox" 
			fill=white 
			x={x + (labelLength/2)} 
			y={y-15} 
			width = {labelWidth} 
			height= {25} 
		> 
		</rect>
		<text
			class="EdgeText"
			x={x + (labelLength/2)}
			y={y}
			dy="0.3em"
		>
			{label}
		</text>
	</g>
{/if}

<style>
	.EdgeText {
		font-size: 16px;
	}	
</style>
