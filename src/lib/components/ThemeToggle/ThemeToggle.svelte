<script lang="ts">
	console.log('Componente ThemeToggle.svelte');
	import type { CSSColorString } from '$lib/types';
	import { getJSONState } from '$lib/utils/savers/saveStore'; // Esta es la función que guarda el estado de los nodos en el localStorage
	import { onMount } from 'svelte';
	import { graphStore } from '$lib/stores';
	import { get } from 'svelte/store';

	export let main = 'light';
	export let alt = 'dark';
	// export let highContrast = 'highContrast';
	/**
	 * @deprecated
	 * @default 'light_mode'
	 * @description (Do not use. Will be deprecated in the next major release.) This prop accepts a string that corresponds to the the name of an icon from the Material Icons library.
	 * @link https://fonts.google.com/icons
	 */
	export let mainIcon = 'light_mode';
	/**
	 * @deprecated
	 * @default 'dark_mode'
	 * @description (Do not use. Will be deprecated in the next major release.) This prop accepts a string that corresponds to the the name of an icon from the Material Icons library.
	 *  @link https://fonts.google.com/icons
	 */
	export let altIcon = 'dark_mode';
	export let corner = 'NE';
	export let bgColor: CSSColorString | null = null;
	export let iconColor: CSSColorString | null = null;

	let current = main;

	function toggleTheme() {
		const currentTheme = document.documentElement.getAttribute('svelvet-theme');
		let newTheme;
		if (!currentTheme || currentTheme === main) {
			newTheme = alt;
		} else {
			newTheme = main;
		}
		current = newTheme;
		document.documentElement.setAttribute('svelvet-theme', newTheme);
		localStorage.setItem('currentTheme', newTheme);
	}

	// Lógica para los nodos
	// Updated by Team v.11.0 we add the logic to localStorage.getItem('state');
	onMount(() => {
		const savedTheme = localStorage.getItem('currentTheme');
		if (savedTheme) {
			document.documentElement.setAttribute('svelvet-theme', savedTheme);
			current = savedTheme;
		} else {
			document.documentElement.setAttribute('svelvet-theme', main);
			current = main;
		}

		// Aquí es donde restauras los nodos cuando la aplicación se monta
		const savedGraphState = localStorage.getItem('state');
		if (savedGraphState) {
			console.log("Al renderizar la aplicacion este componente se ejecuta en este orden")
			const parsedGraphState = JSON.parse(savedGraphState);
			if (parsedGraphState && parsedGraphState.nodes) {
				const graph = get(graphStore);
				console.log(graph)
				graph.set('G-1', parsedGraphState);
				console.log('Restaurando nodos:', parsedGraphState.nodes);
			}
		}
	});

	let graph: any;

	graphStore.subscribe((graphMap) => {
		const graphKey = 'G-G-1';
		graph = graphMap.get(graphKey);
		console.log('Graph from store:', graph);
	});
	function logCurrentGraphState() {
		const currentGraphMap = get(graphStore);
		const graph = currentGraphMap.get('G-G-1');
		// if (graph) {
		// 	console.log('Current Graph State:', graph);
		// } else {
		// 	console.log('No current graph found');
		// }
	}

	// Función que se ejecuta al presionar el botón "Save"
	//optional
	function handleSaveButton() {
		const graphState = get(graphStore).get('G-1'); // Obtiene el estado actual de los nodos
		const jsonState = getJSONState(graphState); // Esto guarda el estado de los nodos
		console.log('Estado de los nodos guardado:', jsonState);
	}
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
		<span class="material-symbols-outlined">{current === main ? altIcon : mainIcon}</span>
	</button>

	<button
		class="save-button NW"
		on:click={() => {
			getJSONState(graph);
		}}>Save</button
	>
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
</style>
