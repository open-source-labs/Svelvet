<script>
  // REPL
  import { onMount } from "svelte";
  import { browser } from "$app/env";
  import { userInfoStore } from '../../authStoreTs';
  import black_logo from "../../assets/Logo 1 black.svg" 
  
  import Repl from "../../repl";
  
  let { user_name } = userInfoStore; 
  
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
  
  <!-- if there's a username, render the name in the playground? else just have playground? follow the svelvet font on the top left? -->
  {#if user_name}
    <div class="user-welcome text-3xl text-gray-700 font-nunito font-medium tracking-wide" >{$user_name} PLAYGR<img src={black_logo} alt="Svelvet log in black"/>UND</div>
  {:else}
  <div class="user-welcome text-3xl text-gray-700 font-nunito font-medium tracking-wide" >{$user_name}PLAYGR<img src={black_logo} alt="Svelvet log in black"/>UND</div>
  {/if}
  
  
  <!-- REPL -->
  <!-- <div class="REPL-container" style="inline-size: 400px; block-size: 400px;"> -->
  <div class="REPL-container">
    {#if browser}
      <Repl {rollupUrl} {svelteUrl} embedded relaxed bind:this={repl} />
    {/if}
  </div>
  
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
      margin-left: .25em;
      margin-right: .25em;
  
      /* inline-size: 800px;
      block-size: 800px; */
    }
    .user-welcome {
      font-size: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: .25em;
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