<script lang="ts">
	import type { CSSColorString } from '$lib/types';
	import { onMount } from 'svelte';


    export let contrastThemes = ['High-Contrast', 'Black/White', 'Yellow/Black', 'Black/Yellow', 'Black/Green', 'Blue/Yellow', 'Yellow/Blue', 'Grayscale', 'Black/Pink']
	export let corner = 'NE';
	export let bgColor: CSSColorString | null = null;
	export let iconColor: CSSColorString | null = null;

	let current = contrastThemes[0];

	function changeTheme(event: { target: { value: any; }; }) {
		const newTheme = event.target.value;
		current = newTheme;
		document.documentElement.setAttribute('svelvet-theme', newTheme);
	}

	onMount(() => {
		document.documentElement.setAttribute('svelvet-theme', contrastThemes[0]);
	});
</script>


<div
	class="contrast-wrapper"
	style:--prop-theme-toggle-color={bgColor}
	style:--prop-theme-toggle-text-color={iconColor}
	class:NE={corner === 'NE'}
>

    <label for="themeSelector" class="visually-hidden" aria-hidden="true">Select Theme:</label>
    <select id="themeSelector" on:change={changeTheme} aria-live="polite" aria-label="Select Theme">
        {#each contrastThemes as contrast (contrast)}
            <option value={contrast} aria-selected={current === contrast}>{contrast}</option>
        {/each}
    </select>
</div>

<style>
	.NE {
		right: 40px;
		top: 10px;
	}
	.contrast-wrapper {
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

    select {
		margin: 0;
		padding: 0;
		border: none;
		background: none;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.2rem 0;
		color: inherit;
        height: 1.6rem;
    }

    .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0,0,0,0);
        border: 0;
    }

</style>
