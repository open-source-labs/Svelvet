<script lang="ts">
	import type { CSSColorString, CustomWritable } from '$lib';
	import type { Writable } from 'svelte/store';

	export let linked: boolean = false;
	export let connecting: boolean = false;
	export let color: CustomWritable<CSSColorString>;
</script>

<div style:--color={$color} class:linked class:connecting class="my-anchor" />

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
