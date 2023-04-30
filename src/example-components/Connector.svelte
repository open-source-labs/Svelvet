<script lang="ts">
	import { Svelvet, Node, Anchor } from '$lib';
	import { getContext } from 'svelte';
	function addAndConnect(connect: (connections: string | number) => void) {
		connect(totalNodes + 4);
		totalNodes++;
	}
	let totalNodes = 0;
</script>

<Node
	position={{ x: 100, y: 300 }}
	dimensions={{ width: 400, height: 300 }}
	let:connect
	let:disconnect
	useDefaults
>
	<div>
		<button on:click={() => connect(2)}>Connect 2</button>
		<button on:click={() => addAndConnect(connect)}>Connect and Add</button>
		<button on:click={() => disconnect(2)}>Disconnect Last From 2</button>
		<button on:click={() => disconnect([[2, '3']])}>Disconnect Node 2/Anchor 3</button>
		<button on:click={() => connect(3)}>Connect 3</button>
		<button on:click={() => disconnect(3)}>Disconnect Last From 3</button>
	</div>
	<Anchor />
</Node>
