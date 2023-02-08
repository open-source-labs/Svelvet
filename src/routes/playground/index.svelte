<!-- 
  We have replaced the repl with StackBlitz for now until the repl store can be fixed.
  To see original repl component, see src/routes/playground-backup/index.svelte
 -->
<script>
</script>

<div class="REPL-container">
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
      inline-size: 100%;
      block-size: 50em;
      margin-left: 0.25em;
      margin-right: 0.25em;
    }
  }

  @media screen and (min-width: 540px) {
    .REPL-container {
      display: block;
      margin: 2em auto 2em;
      inline-size: 80%;
      block-size: 50em;
    }
  }
</style>
