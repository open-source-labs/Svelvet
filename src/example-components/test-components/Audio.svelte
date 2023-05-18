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

	let bassLevel = 0;
	let trebleLevel = 0;
	let volumeLevel = 1;
	let song: string =
		'https://otnmsonvlxvlokpdgsky.supabase.co/storage/v1/object/public/ape-escape-time-station/What%20is%20Love.mp3?t=2023-05-18T05%3A01%3A32.321Z';

	onMount(() => {
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
		gainNode.gain.value = volumeLevel;

		// Connect the audio source to the filters and gain node
		bassFilter.connect(trebleFilter);
		trebleFilter.connect(gainNode);
		gainNode.connect(audioContext.destination);
	});

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

		// Set the bass and treble levels
		bassFilter.gain.value = bassLevel;
		trebleFilter.gain.value = trebleLevel;

		audioSource.start();
	}

	function stop() {
		if (audioSource) {
			audioSource.stop();
			audioSource.disconnect();
			audioSource = null;
		}
	}

	function updateBassLevel() {
		if (bassFilter) {
			bassFilter.gain.value = bassLevel;
		}
	}

	function updateTrebleLevel() {
		if (trebleFilter) {
			trebleFilter.gain.value = trebleLevel;
		}
	}

	function updateVolumeLevel() {
		if (gainNode) {
			gainNode.gain.value = volumeLevel;
		}
	}

	type Inputs = {
		volume: number;
		treble: number;
		bass: number;
	};

	const initialData = {
		volume: 2,
		treble: 2,
		bass: 2
	};
	const processor = (inputs: Inputs) => inputs;
	const inputs = generateInput(initialData);
	const output = generateOutput(inputs, processor);
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
		<div>
			<label for="bass-level">Bass Level:</label>
			<input
				type="range"
				id="bass-level"
				min="-50"
				max="50"
				bind:value={bassLevel}
				on:input={updateBassLevel}
			/>
			<span>{bassLevel} dB</span>
		</div>
		<div>
			<label for="treble-level">Treble Level:</label>
			<input
				type="range"
				id="treble-level"
				min="-12"
				max="12"
				bind:value={trebleLevel}
				on:input={updateTrebleLevel}
			/>
			<span>{trebleLevel} dB</span>
		</div>

		<div>
			<label for="volume-level">Volume Level:</label>
			<input
				type="range"
				id="volume-level"
				min="0"
				max="10"
				bind:value={volumeLevel}
				on:input={updateVolumeLevel}
			/>
			<span>{(volumeLevel * 10).toFixed()}%</span>
		</div>
	</div>
</Node>
