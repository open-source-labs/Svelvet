<!-- Embedding GitHub Gists using iframe -->
<script lang="ts">
  export let src = '';
  export let title = '';
  src = src.slice(src.length - 3) === '.js' ? src : src + '.js';
  title = title === '' ? src : title;
  import { onMount } from 'svelte';
  let frame: any;
  let height = '30px';
  const barGistHeight = 30;
  onMount(() => {
    frame.srcdoc = `<script src='${src}'><${''}/script>`;
  });
  function getInnerHeight() {
    height = frame?.contentWindow?.document?.body?.scrollHeight + barGistHeight + 'px';
  }
</script>

<iframe src="about:blank" bind:this={frame} {title} {height} on:load={getInnerHeight} />

<style>
  iframe {
    border: 0;
    width: 100%;
  }
</style>
