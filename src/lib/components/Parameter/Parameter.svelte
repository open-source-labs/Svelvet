<script lang="ts">
	import Input from '../Input/Input.svelte';
	import Slider from '../Slider/Slider.svelte';
	import RadioGroup from '../RadioGroup/RadioGroup.svelte';
	import type { Parameter, Node, Graph, ParameterConfig } from '$lib/types';

	export let parameterStore: Parameter;
	export let label: string;
	export let config: ParameterConfig;
	export let connectable = false;
	export let node: Node;
	export let graph: Graph;

	const { type } = config;
</script>

<div class="parameter">
	{#if type === 'slider'}
		<Slider {...config} {parameterStore} />
	{/if}
	{#if type === 'radio'}
		<RadioGroup {...config} {parameterStore} />
	{/if}
	{#if connectable}
		<Input {graph} {node} {label} />
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
</style>
