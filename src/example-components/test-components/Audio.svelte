<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import CustomAnchor from './CustomAnchor.svelte';
	import ColorAnchor from './ColorAnchor.svelte';
	import { Node, Anchor } from '$lib';
	import { generateInput, generateOutput } from '$lib';

	let audioContext: any;
	let audioBuffer: any;
	let audioSource: any;
	let bassFilter: any;
	let trebleFilter: any;
	let gainNode: any;

	let song: string =
		'https://otnmsonvlxvlokpdgsky.supabase.co/storage/v1/object/public/ape-escape-time-station/What%20is%20Love.mp3?t=2023-05-18T05%3A01%3A32.321Z';

	type Inputs = {
		bass: number;
		treble: number;
		volume: number;
	};

	const initialData = {
		bass: 2,
		treble: 2,
		volume: 1
	};
	const processor = (inputs: Inputs) => inputs;
	const inputs = generateInput(initialData);
	const output = generateOutput(inputs, processor);

	// onMount(() => {
	// Create an AudioContext instance
	audioContext = new AudioContext();

	// Create the filter nodes
	bassFilter = audioContext.createBiquadFilter();
	trebleFilter = audioContext.createBiquadFilter();

	// Set the filter types
	bassFilter.type = 'lowshelf';
	trebleFilter.type = 'highshelf';

	// Create the gain node for volume control
	gainNode = audioContext.createGain();
	$: gainNode.gain.value = $output.volume;
	console.log(gainNode.gain.value);
	// Set the bass and treble levels

	$: bassFilter.gain.value = $output.bass;
	console.log(bassFilter.gain.value);

	$: trebleFilter.gain.value = $output.treble;
	console.log(trebleFilter.gain.value);

	// Connect the audio source to the filters and gain node
	bassFilter.connect(trebleFilter);
	trebleFilter.connect(gainNode);
	gainNode.connect(audioContext.destination);
	// });

	onDestroy(() => {
		// Clean up resources when the component is destroyed
		stop();
		audioContext.close();
	});

	async function loadAudio(url: string) {
		const response = await fetch(song);
		const arrayBuffer = await response.arrayBuffer();
		audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
	}

	function play() {
		audioSource = audioContext.createBufferSource();
		audioSource.buffer = audioBuffer;

		// Connect the source to the filters
		audioSource.connect(bassFilter);
		audioSource.start();
	}

	function stop() {
		if (audioSource) {
			audioSource.stop();
			audioSource.disconnect();
			audioSource = null;
		}
	}
</script>

<Node useDefaults id="output" position={{ x: 560, y: 450 }} let:selected>
	<div class="input-anchors">
		{#each Object.keys(initialData) as key}
			<Anchor id={key} let:hovering let:connecting let:linked inputsStore={inputs} {key} input>
				<CustomAnchor {hovering} {connecting} {linked} />
			</Anchor>
		{/each}
	</div>
	<div class="node" class:selected>
		<button on:click={() => loadAudio(song)}>Load Audio</button>
		<button on:click={play}>Play</button>
		<button on:click={stop}>Stop Audio</button>

		<div id="bass-level">
			Bass:
			<span>{bassFilter.gain.value} dB</span>
		</div>

		<div id="treble-level">
			Treble:
			<span>{trebleFilter.gain.value} dB</span>
		</div>

		<div id="volume-level">
			Volume:
			<span>{$output.volume.toFixed()}%</span>
		</div>
	</div>
</Node>
