<script lang="ts">
	import Anchor from '../Anchor/Anchor.svelte';
	import Slider from '../Slider/Slider.svelte';
	import RadioGroup from '../RadioGroup/RadioGroup.svelte';
	import type { Writable } from 'svelte/store';
	import type { Parameter } from '$lib/types';

	export let parameterStore: Parameter;
	export let label: string;
	export let config;
	export let object;
	export let connectable = false;

	const { type } = config;
</script>

<div class="input">
	{#if type === 'slider'}
		<Slider {...config} {parameterStore} />
	{/if}
	{#if type === 'radio'}
		<RadioGroup {...config} {parameterStore} />
	{/if}
	{#if connectable}
		<Anchor {object} {label} />
	{/if}
</div>

<style>
	.input {
		/* border: solid 1px green; */
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 20px;
	}
</style>
