<script>
  import Gist from '../../components/Gist.svelte';
  import Svelvet from 'svelvet';

  const initialNodes = [
    {
      id: 1,
      position: { x: 200, y: 50 },
      data: { label: 'Input Node' },
      width: 175,
      height: 40,
      bgColor: 'white'
    },
    {
      id: 2,
      position: { x: 25, y: 150 },
      data: { label: 'Option #1' },
      width: 175,
      height: 40,
      bgColor: '#B8FFC6',
      borderColor: 'transparent'
    },
    {
      id: 3,
      position: { x: 375, y: 150 },
      data: { label: 'Option #2' },
      width: 175,
      height: 40,
      bgColor: '#FFB8B8',
      borderColor: 'transparent'
    }
  ];
  const initialEdges = [
    { id: 'e1-2', source: 1, target: 2, label: ' YES ', animate: true },
    { id: 'e2-3', source: 1, target: 3, label: ' NO ', animate: true }
  ];

  // REPL
  import { onMount } from "svelte";
	import { browser } from "$app/env";

	import Repl from "$lib/repl";

	const rollupUrl = `https://unpkg.com/rollup@1/dist/rollup.browser.js`;
	const svelteUrl = `https://unpkg.com/svelte@3`;

	let repl = null;

	onMount(() => repl.set({
		components: [
			{
				name: "App",
				type: "svelte",
				source: ``
			}
		]
	}));


</script>

<div>
  <h2 class="text-4xl font-semibold mb-12">TypeScript</h2>
  <h3 class="text-xl font-semibold">Usage</h3>
  <p class="my-4 text-gray-600">
    <code class="code">Svelvet</code> is written in TypeScript, and provides types for the nodes and
    edges for you to use. Below is an example of a simple flow diagram utilizing our types.
  </p>
  <p class="my-4 text-gray-600">
    Set the script tag to <code class="code">lang="ts"</code>. Import <code class="code">Node</code>
    and <code class="code">Edge</code> to use them as types.
  </p>
</div>

<Gist src="https://gist.github.com/andrew-widjaja/33aee7aedbb37a7f168525e109415968" />

<p class="my-4 text-gray-600">The diagram renders as below:</p>
<div class="border rounded-lg shadow-md w-full overflow-hidden">
  <Svelvet nodes={initialNodes} edges={initialEdges} width={1200} height={400} background />
</div>

<!-- REPL -->
<div style="inline-size: 400px; block-size: 400px;">
	{#if browser}
		<Repl {rollupUrl} {svelteUrl} embedded relaxed bind:this={repl} />
	{/if}
</div>
