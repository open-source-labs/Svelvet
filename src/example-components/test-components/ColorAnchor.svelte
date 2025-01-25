<script lang="ts">
	import type { CSSColorString, CustomWritable } from '$lib';

	interface Props {
		linked?: boolean;
		connecting?: boolean;
		color: CustomWritable<CSSColorString>;
	}

	let { linked = false, connecting = false, color }: Props = $props();
</script>

<div style:--color={$color} class:linked class:connecting class="my-anchor"></div>

<style>
	.my-anchor {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background-color: var(--color);
		border: solid 2px white;
		border-color: inherit;
		box-sizing: border-box;
	}
	.connecting {
		animation: pulse 1s infinite;
	}

	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 var(--color);
		}
		70% {
			box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
		}
	}
</style>
