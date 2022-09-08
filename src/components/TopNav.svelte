<script lang="ts">
  import logo from '../assets/Logo 1.svg';
  import github from '../assets/github-icon-white.svg';
  import { page } from '$app/stores';
  import MobileHomeNav from './MobileHomeNav.svelte';
  import MobileDocsNav from './MobileDocsNav.svelte';
  import { signInWithGithub, logout, userInfo } from '../supabase-db';


  import { userInfoStore } from '../authStoreTs'

  let { user, logged_in, user_avatar } = userInfoStore;
  // use set method on user writable and set it equal to the return value of userIndo
  // user.set(userInfo);

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

    <p class="text-xs rounded-full px-4 py-1 bg-rose-100 text-red-400 tracking-wider">v3.0.0</p>
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

    <!-- <a
    href="/community/forum"
    id="community"
    class="hover:text-rose-500 {activeLink.includes('community') ? 'text-rose-500' : ''}">Community</a
    > -->

    <a
      target="_blank"
      href="https://medium.com/@justinwouters/svelvet-2-0-c6b2059734a6"
      id="blog"
      class="hover:text-rose-500 {activeLink.includes('blog') ? 'text-rose-500' : ''}">Blog</a
    >

    <a
      href="https://github.com/open-source-labs/Svelvet"
      id="github"
      target="_blank"
      class="hover:text-rose-500">Github</a
    >

    <a
      href="/playground"
      id="playground"
      class="hover:text-rose-500 {activeLink.includes('REPL') ? 'text-rose-500' : ''}">REPL</a
    >

    <!-- Add logic for OAuth and conditionally render if the user is logged in, change button text to sign out and vice versa -->

    {#if $user}
      <button on:click={logout}>
        <!-- <div class="login-container rounded-full px-4 py-1 bg-rose-100 text-red-400 tracking-wider hover:text-rose-500 hover:bg-white">Logout
          <img src={$user_avatar} alt="user pic"/>
        </div> -->
        <div class="login-container px-6 py-3 btn-primary">Logout
          <img src={$user_avatar} alt="user pic"/>
        </div>
      </button>

      <!-- <img id="github-avatar" alt="github-avatar-photo"> -->
    {:else}
      <button on:click={signInWithGithub}><div class="login-container px-6 py-3 btn-primary">
        Log In
        <img src={github} alt="github-logo" />
      </div></button>
    {/if}


  </nav>
</div>

<style>

.login-container{
  display: flex;
  width: 8em;
  justify-content: space-between;
  border-style: solid;
  border-width: 1.25px;
  border-color: #ff4561;
  border-radius: 2em;
  align-items: center;
  flex: 1;
  float: left;
  padding: .25em 1em .25em;
}

.login-container img {
  display: inline-block;
  margin-left: 5px;
  height: 32px;
  width: 32px;
  border-radius: 50%;
}



</style>