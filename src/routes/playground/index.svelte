<script>
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

<!-- REPL -->
<div style="inline-size: 400px; block-size: 400px;">
	{#if browser}
    
		<Repl {rollupUrl} {svelteUrl} embedded relaxed bind:this={repl} />
    <button>Save TESTING</button>
	{/if}
</div>
