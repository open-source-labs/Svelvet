<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { Theme, ThemeGroup, CSSColorString } from '$lib/types';
	import { getContext } from 'svelte';
	import { THEMES } from '$lib/constants/themes';

	const themeStore: Writable<ThemeGroup> = getContext('themeStore');

	export let main: Theme = 'dark';
	export let alt: Theme = 'light';
	export let corner = 'NE';
	export let bgColor: CSSColorString | null = null;
	export let iconColor: CSSColorString | null = null;

	let current: Theme = main;

	function toggleTheme() {
		current = current === main ? alt : main;
	}

	$: $themeStore = THEMES[current];
</script>

<div
	class="controls-wrapper"
	style:background-color={bgColor || $themeStore.controls}
	style:color={iconColor || $themeStore.text}
	class:SW={corner === 'SW'}
	class:NE={corner === 'NE'}
	class:SE={corner === 'SE'}
	class:NW={corner === 'NW'}
>
	<button on:mousedown|stopPropagation={toggleTheme}>
		<span class="material-symbols-outlined">{current === main ? 'light_mode' : 'dark_mode'}</span>
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
		box-shadow: var(--shadow-elevation-low);
		padding: 4px;
		width: fit-content;
		height: fit-content;
		cursor: pointer;
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
