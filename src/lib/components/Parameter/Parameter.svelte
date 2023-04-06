<script lang="ts">
	import Slider from '../Slider/Slider.svelte';
	import RadioGroup from '../RadioGroup/RadioGroup.svelte';
	import type { Parameter, Node, Graph, ParameterConfig } from '$lib/types';
	import type { Writable } from 'svelte/store';
	import ColorPicker from '../ColorPicker/ColorPicker.svelte';
	import { getContext, setContext } from 'svelte';
	import { writable } from 'svelte/store';

	export let parameterStore: Writable<Parameter>;
	export let label: string;
	export let config: ParameterConfig;
	export let connectable = false;

	const drivenStore = writable(false);
	$: driven = $drivenStore;

	const node = getContext<Node>('node');
	const graph = getContext<Graph>('graph');

	setContext<string>('label', label);
	setContext<Writable<boolean>>('driven', drivenStore);

	const { type } = config;

	const { edges } = graph;

	const components = {
		slider: Slider,
		radio: RadioGroup,
		color: ColorPicker
	};
</script>

<div class="parameter">
	{#if !driven}
		<svelte:component this={components[type]} {...config} {parameterStore} />
	{:else}
		<p class="driven-label">{label}</p>
	{/if}
</div>

<style>
	.parameter {
		/* border: solid 1px green; */
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 20px;
	}

	.driven-label {
		padding-left: 0.5rem;
		width: 100%;
	}
</style>
