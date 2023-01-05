<script lang="ts">
  import logo from '../assets/Logo 1.svg';
  import github from '../assets/github-icon-white.svg';
  import { page } from '$app/stores';
  import MobileHomeNav from './MobileHomeNav.svelte';
  import MobileDocsNav from './MobileDocsNav.svelte';
  import { signInWithGithub, logout, userInfo } from '../supabase-db';

  import { userInfoStore } from '../authStoreTs';

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

    <p class="text-xs rounded-full px-4 py-1 bg-rose-100 text-red-400 tracking-wider">v5.0.1</p>
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

    
      <div class="dropdown">
        <button class="dropbtn hover:text-rose-500">Blogs
          <i class="fa fa-caret-down"></i>
        </button>
        <div class="dropdown-content">
          <a target="_blank" class="hover:text-rose-500 {activeLink.includes('blog') ? 'text-rose-500' : ''}" href="https://medium.com/@alexander.zambrano/simplify-application-diagramming-with-svelvet-a8f664731243">Svelvet 1.0</a>
          <a target="_blank" class="hover:text-rose-500 {activeLink.includes('blog') ? 'text-rose-500' : ''}" href="https://medium.com/gitconnected/svelvet-2-0-c6b2059734a6">Svelvet 2.0</a>
          <a target="_blank" class="hover:text-rose-500 {activeLink.includes('blog') ? 'text-rose-500' : ''}" href="https://medium.com/@MauricioACastro/svelvet-4-0-the-power-of-html-is-now-inside-your-nodes-3d96823096e3">Svelvet 4.0</a>
          <a target="_blank" class="hover:text-rose-500 {activeLink.includes('blog') ? 'text-rose-500' : ''}" href="https://medium.com/@efergus1/svelvet-5-0-a-community-driven-update-cfcc93e7b7a7">Svelvet 5.0</a>
        </div>
      </div>
  

    <!-- Add logic for OAuth and conditionally render if the user is logged in, change button text to sign out and vice versa -->

    {#if $user}
      <button on:click={logout}>
        <!-- <div class="login-container rounded-full px-4 py-1 bg-rose-100 text-red-400 tracking-wider hover:text-rose-500 hover:bg-white">Logout
          <img src={$user_avatar} alt="user pic"/>
        </div> -->
        <div class="login-container px-6 py-3 btn-primary">
          Logout
          <img src={$user_avatar} alt="user pic" />
        </div>
      </button>

      <!-- <img id="github-avatar" alt="github-avatar-photo"> -->
    {:else}
      <button on:click={signInWithGithub}
        ><div class="login-container px-6 py-3 btn-primary">
          Log In
          <img src={github} alt="github-logo" />
        </div></button
      >
    {/if}
  </nav>
</div>

<style>
  .login-container {
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
    padding: 0.25em 1em 0.25em;
  }

  .login-container img {
    display: inline-block;
    margin-left: 5px;
    height: 32px;
    width: 32px;
    border-radius: 50%;
  }

   /* Navbar container */



/* The dropdown container */
.dropdown {
  float: left;
  overflow: hidden;
}

/* Dropdown button */
.dropdown .dropbtn {
  font-size: 0.875rem;
line-height: 1.25rem;
text-decoration: inherit;
  font-weight: 500;/* Important for vertical align on mobile phones */
  margin: 0; /* Important for vertical align on mobile phones */
}

/* Add a red background color to navbar links on hover */
.dropdown a:hover, .dropdown:hover .dropbtn {
  background-color: rgb(255, 255, 255);
  color: #ff4561;
}

/* Dropdown content (hidden by default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content a {
  float: none;
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}

/* Add a grey background color to dropdown links on hover */
.dropdown-content a:hover {
  background-color: #ddd;
}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
  display: block;
} 
</style>
