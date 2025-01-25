<!-- @migration-task Error while migrating Svelte code: Cannot use rune without parentheses
https://svelte.dev/e/rune_missing_parentheses -->
<!-- @migration-task Error while migrating Svelte code: Cannot use rune without parentheses
https://svelte.dev/e/rune_missing_parentheses -->
<script lang="ts">
	import type { CSSColorString } from '$lib/types';
	import { getJSONState } from '$lib/utils/savers/saveStore';
	import { onMount } from 'svelte';
	import { graphStore } from '$lib/stores';
	import { get } from 'svelte/store';

	$props = {
		main: 'light',
		alt: 'dark',
		mainIcon: 'light_mode',
		altIcon: 'dark_mode',
		corner: 'NE',
		bgColor: null,
		iconColor: null,
		onToggleTheme: null,
		onSave: null,
		themeOptions: ['light', 'dark', 'Black/White', 'Yellow/Black', 'Black/Yellow', 'Yellow/Blue', 'Grayscale', 'Black/Pink']
	};

	$state = {
		current: $props.main
	};

	function toggleTheme() {
		try {
			const currentTheme = document.documentElement.getAttribute('svelvet-theme');
			let newTheme;
			if (!currentTheme || currentTheme === $props.main) {
				newTheme = $props.alt;
				$state.current = $props.alt;
			} else {
				newTheme = $props.main;
				$state.current = $props.main;
			}
			document.documentElement.setAttribute('svelvet-theme', newTheme);

			// Save the current theme to Local Storage
			localStorage.setItem('currentTheme', newTheme);

			if ($props.onToggleTheme) $props.onToggleTheme(newTheme);
		} catch (error) {
			console.error('Error toggling theme:', error);
		}
	}

	function setTheme(theme: string) {
		try {
			document.documentElement.setAttribute('svelvet-theme', theme);
			$state.current = theme;

			// Save the current theme to Local Storage
			localStorage.setItem('currentTheme', theme);

			if ($props.onToggleTheme) $props.onToggleTheme(theme);
		} catch (error) {
			console.error('Error setting theme:', error);
		}
	}

	onMount(() => {
		try {
			const savedTheme = localStorage.getItem('currentTheme');
			if (savedTheme) {
				document.documentElement.setAttribute('svelvet-theme', savedTheme);
				$state.current = savedTheme;
			} else {
				// If no theme is saved in Local Storage, set the default theme (main) as the initial theme
				document.documentElement.setAttribute('svelvet-theme', $props.main);
				$state.current = $props.main;
			}
		} catch (error) {
			console.error('Error setting initial theme:', error);
		}
	});

	let graph: any;

	graphStore.subscribe((graphMap) => {
		const graphKey = 'G-1';
		graph = graphMap.get(graphKey);
			// console.log('Graph from store:', graph);
	});
	function logCurrentGraphState() {
		try {
			const currentGraphMap = get(graphStore);
			const graph = currentGraphMap.get('G-1');
			// if (graph) {
			// 	console.log('Current Graph State:', graph);
			// } else {
			// 	console.log('No current graph found');
			// }
		} catch (error) {
			console.error('Error logging current graph state:', error);
		}
	}
</script>

<div
	class="controls-wrapper"
	style:--prop-theme-toggle-color={$props.bgColor}
	style:--prop-theme-toggle-text-color={$props.iconColor}
	class:SW={$props.corner === 'SW'}
	class:NE={$props.corner === 'NE'}
	class:SE={$props.corner === 'SE'}
	class:NW={$props.corner === 'NW'}
>
	<button onclick={toggleTheme} ontouchstart={toggleTheme}>
		<span class="material-symbols-outlined">{$state.current === $props.main ? $props.altIcon : $props.mainIcon}</span>
	</button>

	<button
		class="save-button NW"
		onclick={() => {
			try {
				getJSONState(graph);
				if ($props.onSave) $props.onSave();
			} catch (error) {
				console.error('Error saving graph state:', error);
			}
		}}>Save</button
	>

	<select
		class="theme-selector"
		onchange={(e) => setTheme((e.target as HTMLSelectElement).value)}
	>
		{#each $props.themeOptions as themeOption}
			<option value={themeOption} selected={themeOption === $state.current}>{themeOption}</option>
		{/each}
	</select>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0');

	span {
		font-family: 'Material Symbols Outlined';
		font-size: 1.2rem;
		color: inherit;
	}

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
	.save-button {
		top: 10px; /* Adjust the top position as needed */
		left: 10px; /* Adjust the left position as needed */
		background-color: var(--save-button-bg-color, var(--default-save-button-bg-color));
		color: var(--save-button-text-color, var(--default-save-button-text-color));
		border: solid 1px var(--save-button-border-color, var(--default-save-button-border-color));
		cursor: pointer;
	}
	.theme-selector {
		margin-top: 10px;
		padding: 5px;
		border-radius: 4px;
		border: 1px solid var(--theme-toggle-border, var(--default-theme-toggle-border));
		background-color: var(--theme-toggle-color, var(--default-theme-toggle-color));
		color: var(--theme-toggle-text-color, var(--default-theme-toggle-text-color));
	}
</style>
