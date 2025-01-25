<script lang="ts">
	import { run } from 'svelte/legacy';

	import { onDestroy } from 'svelte';
	import CustomAnchor from './CustomAnchor.svelte';
	import ColorAnchor from './ColorAnchor.svelte';
	import { Node, Anchor } from '$lib';
	import { generateInput, generateOutput } from '$lib';

	let audioContext: any;
	let audioBuffer: any;
	let audioSource: any;
	let bassFilter: any = $state();
	let trebleFilter: any = $state();
	let gainNode: any = $state();

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
		volume: 0.01
	};
	const processor = (inputs: Inputs) => inputs;
	const inputs = generateInput(initialData);
	const output = generateOutput(inputs, processor);

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
	run(() => {
		gainNode.gain.value = $output.volume;
	});

	// Set the bass and treble levels
	run(() => {
		bassFilter.gain.value = $output.bass;
	});

	run(() => {
		trebleFilter.gain.value = $output.treble;
	});
	console.log($output.treble);

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

<Node useDefaults id="output" position={{ x: 550, y: 300 }} >
	{#snippet children({ selected })}
		<div class="contentWrapper">
			<div class="node" class:selected>
				<button onclick={() => loadAudio(song)}>Load Audio</button>
				<button onclick={play}>Play</button>
				<button onclick={stop}>Stop</button>
			</div>
			<div class="audio_controls">
				<div class="col input-anchors">
					{#each Object.keys(initialData) as key}
						<Anchor id={key}    inputsStore={inputs} {key} input>
							{#snippet children({ hovering, connecting, linked })}
												<CustomAnchor {hovering} {connecting} {linked} />
																		{/snippet}
										</Anchor>
					{/each}
				</div>
				<div class="col col_2">
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
			</div>
		</div>
	{/snippet}
</Node>

<style>
	.contentWrapper {
		padding: 1rem;
	}
	.audio_controls {
		padding-top: 1rem;
	}
	.col {
		line-height: 1.5rem;
	}
	.input-anchors {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 12px;
		left: -24px;
	}
	button {
		border-radius: 4px;
	}
</style>
