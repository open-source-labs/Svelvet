<script lang="ts">
	import Input from '../Input/Input.svelte';
	import Slider from '../Slider/Slider.svelte';
	import RadioGroup from '../RadioGroup/RadioGroup.svelte';
	import type { Parameter, Node, Graph, ParameterConfig } from '$lib/types';
	import type { Writable } from 'svelte/store';
	import ColorPicker from '../ColorPicker/ColorPicker.svelte';
	import { getContext, setContext } from 'svelte';

	export let parameterStore: Writable<Parameter>;
	export let label: string;
	export let config: ParameterConfig;
	export let connectable = false;

	const node = getContext<Node>('node');
	const graph = getContext<Graph>('graph');

	$: driven = $edges.has(`${node.id}-${label}`);

	setContext<string>('label', label);
	setContext<boolean>('driven', driven);

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
	{#if connectable}
		<Input />
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
