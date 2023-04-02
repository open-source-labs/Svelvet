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

<p
	role="note"
	aria-label={label}
	style:background-color={color}
	style:top={CSStop}
	style:left={CSSleft}
	style:color={textColor}
	class="edge-label"
>
	{label}
</p>

<style>
	.label {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		width: fit-content;
		height: 2rem;
		border-radius: 5px;
		padding: 10px;
		transform: translateX(-50%) translateY(-50%);
		z-index: 11;
	}
</style>
