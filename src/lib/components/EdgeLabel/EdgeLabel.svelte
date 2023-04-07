<script lang="ts">
	import type { CSSColorString } from '$lib/types';

	export let label: string;
	export let top: number;
	export let left: number;
	export let color: CSSColorString = 'white';
	export let textColor: CSSColorString = 'black';

	$: CSStop = `${top}px`;
	$: CSSleft = `${left}px`;
</script>

<div
	role="note"
	aria-label={label}
	style:background-color={color}
	style:top={CSStop}
	style:left={CSSleft}
	style:color={textColor}
	class="edge-label"
>
	<slot />
</div>

<style>
	.edge-label {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		width: fit-content;
		font-size: 1rem;
		height: 1.5rem;
		border-radius: 5px;
		padding: 10px;
		transform: translateX(-50%) translateY(-50%);
		z-index: -3;
		cursor: pointer !important;
	}
</style>
