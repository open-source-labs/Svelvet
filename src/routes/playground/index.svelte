<!-- 
  We have replaced the repl with StackBlitz for now until the repl store can be fixed.
  To see original repl component, see src/routes/playground-backup/index.svelte
 -->
<script>
</script>

<div class="REPL-container">
  <!-- Replaced  repl with stackblitz until we can figure out the store  -->
  <!-- {#if browser}
    <Repl {rollupUrl} {svelteUrl} embedded relaxed bind:this={repl} />
  {/if} -->

  <p>
    If you are using a non-chromium based browser, use this direct <a
      href="https://stackblitz.com/edit/sveltejs-kit-template-default-wyqprd?file=src/routes/+layout.svelte"
      style="color: blue">link</a
    > instead
  </p>

  <iframe
    src="https://stackblitz.com/edit/sveltejs-kit-template-default-wyqprd?embed=1&file=src/routes/+layout.svelte"
    style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
    title="Custom Svelte Components"
    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  />
</div>

<!-- <meta http-equiv="refresh" content="15"> -->
<style>
  @media screen and (max-width: 539px) {
    .REPL-container {
      display: block;
      /* margin: 2em auto 2em; */
      /* position: absolute; */
      /* width: 80%; */
      /* height: 80%; */
      inline-size: 100%;
      block-size: 50em;
      margin-left: 0.25em;
      margin-right: 0.25em;

      /* inline-size: 800px;
      block-size: 800px; */
    }
    .user-welcome {
      font-size: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 0.25em;
    }
    .user-welcome img {
      display: inline-block;
      height: 1.85rem;
    }
  }

  @media screen and (min-width: 540px) {
    .REPL-container {
      display: block;
      margin: 2em auto 2em;
      /* position: absolute; */
      /* width: 80%; */
      /* height: 80%; */
      inline-size: 80%;
      block-size: 50em;

      /* inline-size: 800px;
      block-size: 800px; */
    }
    .user-welcome {
      display: flex;
      justify-content: flex-end;
      padding: 1em 1em 1em;
      padding-right: 2em;
    }
    .user-welcome img {
      height: 1.85rem;
    }
  }
</style>
