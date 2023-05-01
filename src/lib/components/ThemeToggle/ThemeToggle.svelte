<script lang="ts">
	import type { CSSColorString } from '$lib/types';
	import { onMount } from 'svelte';

	export let main = 'light';
	export let alt = 'dark';
	export let corner = 'NE';
	export let bgColor: CSSColorString | null = null;
	export let iconColor: CSSColorString | null = null;

	let current = main;

	function toggleTheme() {
		const currentTheme = document.documentElement.getAttribute('svelvet-theme');
		document.documentElement.setAttribute('svelvet-theme', currentTheme === main ? alt : main);
	}

	onMount(() => {
		document.documentElement.setAttribute('svelvet-theme', main);
	});
</script>

<div
	class="controls-wrapper"
	style:--prop-theme-toggle-color={bgColor}
	style:--prop-theme-toggle-text-color={iconColor}
	class:SW={corner === 'SW'}
	class:NE={corner === 'NE'}
	class:SE={corner === 'SE'}
	class:NW={corner === 'NW'}
>
	<button on:mousedown|stopPropagation={toggleTheme} on:touchstart|stopPropagation={toggleTheme}>
		<span class="material-symbols-outlined">{current === main ? 'dark_mode' : 'light_mode'}</span>
	</button>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0');
	* {
		box-sizing: border-box;
	}
	.NW {
		left: 10px;
		top: 10px;
	}

	.NE {
		right: 10px;
		top: 10px;
	}

	.SE {
		right: 10px;
		bottom: 10px;
	}

	.SW {
		left: 10px;
		bottom: 10px;
	}
	.controls-wrapper {
		position: absolute;
		display: flex;
		width: 1.5rem;
		flex-direction: column;
		border-radius: 6px;
		overflow: hidden;
		padding: 4px;
		width: fit-content;
		height: fit-content;
		cursor: pointer;
		box-shadow: var(--theme-toggle-shadow, var(--default-theme-toggle-shadow));
		border: solid 1px var(--theme-toggle-border, var(--default-theme-toggle-border));
		color: var(
			--prop-theme-toggle-text-color,
			var(--theme-toggle-text-color, var(--default-theme-toggle-text-color))
		);
		background-color: var(
			--prop-theme-toggle-color,
			var(--theme-toggle-color, var(--default-theme-toggle-color))
		);
	}

	/* reset button */
	button {
		margin: 0;
		padding: 0;
		border: none;
		background: none;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.2rem 0;
		border-bottom: solid 1px rgb(190, 188, 188);
		color: inherit;
	}
	span {
		font-family: 'Material Symbols Outlined';
		font-size: 1.2rem;
		color: inherit;
	}
	button:last-child {
		border-bottom: none;
	}
	button:hover {
		cursor: pointer;
	}
</style>
