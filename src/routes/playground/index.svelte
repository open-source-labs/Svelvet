<script>
  // REPL
  import { onMount } from 'svelte';
  import { browser } from '$app/env';
  import { userInfoStore } from '../../authStoreTs';
  import black_logo from '../../assets/Logo 1 black.svg';
  import Repl from '../../repl';
  import PlaygoundTips from '../../repl/shortcuts/PlaygoundTips.svelte';
  import { tipsToggle, docsToggle } from '../../playgroundStore';
  import DocsModal from '../../repl/shortcuts/DocsModal.svelte';

  let { user_name } = userInfoStore;

  const rollupUrl = `https://unpkg.com/rollup@1/dist/rollup.browser.js`;
  const svelteUrl = `https://unpkg.com/svelte@3`;

  let repl = null;

  onMount(() =>
    repl.set({
      components: [
        {
          name: 'App',
          type: 'svelte',
          source: ``,
        },
      ],
    })
  );
</script>

<!-- if there's a username, render the name in the playground? else just have playground? follow the svelvet font on the top left? -->
{#if user_name}
  <div
    class="user-welcome text-3xl text-gray-700 font-nunito font-medium tracking-wide"
  >
    {$user_name} PLAYGR<img src={black_logo} alt="Svelvet logo in black" />UND
  </div>
{:else}
  <div
    class="user-welcome text-3xl text-gray-700 font-nunito font-medium tracking-wide"
  >
    {$user_name}PLAYGR<img src={black_logo} alt="Svelvet logo in black" />UND
  </div>
{/if}
<!-- playground tips and tricks  -->
<!-- {#if $tipsToggle === true}
  <PlaygoundTips />
{/if}
{#if $docsToggle === true}
  <DocsModal />
{/if} -->

<!-- REPL -->
<div class="REPL-container">
  <!-- Replaced  repl with stackblitz until we can figure out the store  -->
  <!-- {#if browser}
    <Repl {rollupUrl} {svelteUrl} embedded relaxed bind:this={repl} />
  {/if} -->

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
