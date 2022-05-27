<script lang="ts">
	import { onMount } from 'svelte';

	export let edgeTextProps: any;

	$: ({ x, y, label } = edgeTextProps);

	let labelLength = 0;
	let textWidth = 0;

	onMount(() => {
		let labelText = document.querySelectorAll('.EdgeText');
		labelText.forEach((el) => {
			if (el.innerHTML === label) {
				textWidth = el.getComputedTextLength();
			}
		});
		if (textWidth <= 50) labelLength = textWidth * 2;
		if (textWidth > 50 && textWidth < 60) {
			labelLength = textWidth * 0.5;
		}
		if (textWidth >= 60) {
			textWidth <= 175 ? (labelLength = textWidth * -0.2) : (labelLength = textWidth * -0.8);
		}
	});
</script>

{#if typeof label === 'undefined' || !label}
	{null}
{:else}
	<g>
		<rect
			class="InvisibleBox"
			fill="white"
			x={x + labelLength / 2}
			y={y - 15}
			width={textWidth}
			height={25}
		/>
		<text class="EdgeText" x={x + labelLength / 2} {y} dy="0.3em">
			{label}
		</text>
	</g>
{/if}

<style>
	.EdgeText {
		font-size: 14px;
		z-index: 10;
	}
</style>
