<script lang="ts">
  import logo from '../assets/Logo 1.svg';
  import { page } from '$app/stores';
  import MobileHomeNav from './MobileHomeNav.svelte';
  import MobileDocsNav from './MobileDocsNav.svelte';
  import GitHubLogo from '../assets/GitHubLogo.png'
  import { signInWithGithub, logout, userInfo } from '../supabase-db';

  import { user, logged_in } from '$lib/stores/authStore.js'

  // use set method on user writable and set it equal to the return value of userIndo
  user.set(userInfo);

  $: activeLink = `${$page.url.pathname}`;
  let y: number;

</script>

<svelte:window bind:scrollY={y} />
<!-- Toggled Mobile Navbar -->
{#if activeLink.includes('docs')}
  <MobileDocsNav />
{:else}
  <MobileHomeNav />
{/if}

<!-- Navbar -->
<div
  class:shadow-lg={y > 5}
  class="static hidden md:flex justify-between px-8 py-3 w-screen border-b h-16 bg-white"
>
  <div class="flex items-center justify-center">
    <img src={logo} alt="Logo" class="aspect-ratio-auto h-8" />
    <a
      id="home"
      href="/"
      on:click={() => {
        activeLink = '/';
      }}
      class="text-3xl text-gray-700 font-nunito font-medium tracking-wide ml-2 mr-6">svelvet</a
    >
    <p class="text-xs rounded-full px-4 py-1 bg-rose-100 text-red-400 tracking-wider">v1.0.3</p>
  </div>
  <nav class="space-x-11 text-sm text-gray-500 font-medium flex items-center">
    <a href="/" id="home" class="hover:text-rose-500 {activeLink === '/' ? 'text-rose-500' : ''}"
      >Home</a
    >
    <a
      href="/docs/installation"
      id="docs"
      class="hover:text-rose-500 {activeLink.includes('docs') ? 'text-rose-500' : ''}">Docs</a
    >
    <a
      target="_blank"
      href="https://medium.com/@alexander.zambrano/simplify-application-diagramming-with-svelvet-a8f664731243"
      id="blog"
      class="hover:text-rose-500 {activeLink.includes('blog') ? 'text-rose-500' : ''}">Blog</a
    >
    <a
      href="https://github.com/open-source-labs/Svelvet"
      id="github"
      target="_blank"
      class="hover:text-rose-500 pr-5">Github</a
    >
    <a
      href="/playground"
      id="playground"
      class="hover:text-rose-500 {activeLink.includes('playground') ? 'text-rose-500' : ''}">Playground</a
    >
    <!-- Add logic for OAuth and conditionally render if the user is logged in, change button text to sign out and vice versa -->
    
    <div class="login-container">
      
      {#if $logged_in}
        <button on:click={logout}>Logout</button>
      {:else}
        <button on:click={signInWithGithub}>Log in</button>
      {/if}
    </div>
    
    <button on:click={() => (console.log('user', userInfo))}>Session</button>
    
  </nav>
</div>

<style>
.login-container{
  display: flex;
  justify-content: space-between;
  
}

.login-container img {
  
}
</style>