<script lang="ts">
	import { Svelvet, Node, Toggle, Anchor } from '$lib';
	import { generateInput, generateOutput } from '$lib';
	import ArrowEdge from '../arrows/ArrowEdge.svelte';

	type InputStructure = {
		value: boolean;
	};

	const initialData = {
		value: false
	};

	const inputs = generateInput(initialData);
	const processor = (inputs: InputStructure) => inputs.value;
	const outputs = generateOutput(inputs, processor);
</script>

<Svelvet minimap controls width={1000} height={500}>
	<Node width={200} height={150} useDefaults position={{ x: 100, y: 50 }} bgColor="lightskyblue">
		<div class="wrapper">
			<h2>New Toggle Component!</h2>
			<Toggle parameterStore={$inputs.value} />
		</div>
		<div class="out">
			<Anchor outputStore={outputs} output edge={ArrowEdge} />
		</div>
	</Node>

	<Node
		id={'displayNode'}
		useDefaults
		width={200}
		height={100}
		position={{ x: 650, y: 300 }}
		bgColor={$outputs ? 'blue' : 'red'}
		textColor="white"
	>
		<h2 id="output-num">{$outputs}</h2>
		<div class="in">
			<Anchor inputsStore={inputs} input direction="west" />
		</div>
	</Node>
</Svelvet>

<style>
	h2 {
		text-align: center;
	}
	.wrapper {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		position: relative;
		justify-content: center;
		align-items: center;
	}
	.out {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 10px;
		top: 70px;
		left: 205px;
	}
	.in {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 10px;
		top: 45px;
		left: -16px;
	}
</style>
