<script lang="ts">
	import TextField from '$lib/components/data/TextField/TextField.svelte';
	import { Svelvet, Node } from '$lib';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';

	const textStore = writable(''); // Creating a writable store
	setContext('textStore', textStore); // Setting up the context
</script>

<Svelvet width={1000} height={1000}>
	<Node width={400} height={200} useDefaults>
		<TextField placeholder={'test placeholder'} />
	</Node>
	<Node width={400} height={200} position={{ x: 0, y: 300 }} useDefaults>
		{$textStore}
	</Node>
</Svelvet>
