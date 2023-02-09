<script lang="ts">
  import { page } from '$app/stores'
  import { windowStore } from '../stores/windowStore'
  import Footer from '../components/Footer.svelte'
  import Navbar from '../components/Navbar.svelte'
  import '../styles/app.css'

  let { width, height, scrollY, scrollX } = windowStore 
 
</script>

<svelte:window bind:innerWidth={$width} 
               bind:innerHeight={$height} 
               bind:scrollY={$scrollY} 
               bind:scrollX={$scrollX} />

{#if $page.url.pathname === '/testingplayground'}
  <slot />
{:else}
  <Navbar />
  <slot />
  <Footer />
{/if}
