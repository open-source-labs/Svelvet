<script lang="ts">
  import logo from '../assets/Logo 1.svg';
  import rightArrow from '../assets/arrow-right.svg';
  import downArrow from '../assets/arrow-down.svg';
  import { page } from '$app/stores';
  import { slide, fade } from 'svelte/transition';

  $: activeLink = `${$page.url.pathname}`;

  let hidden = true;
  let showGettingStarted = false;
  let showGuides = false;

  const toggleMenu = () => {
    hidden = !hidden;
  };
  const toggleGettingStarted = () => {
    showGettingStarted = !showGettingStarted;
  };
  const toggleGuides = () => {
    showGuides = !showGuides;
  };
  let y: number;
</script>

<svelte:window bind:scrollY={y} />

<div
  class:shadow-lg={y > 5}
  class="md:hidden sticky top-0 z-50 flex justify-between px-8 py-3 w-screen border-b h-16 bg-white"
>
  <div class="flex items-center">
    <img src={logo} alt="Logo" class="aspect-ratio-auto h-8" />
    <a
      id="home"
      href="/"
      class="text-3xl text-gray-700 font-nunito font-medium tracking-wide ml-2 mr-6">svelvet</a
    >
  </div>
  <button class="outline-none mobile-menu-button pl-8 " on:click={toggleMenu}>
    <div id="navMenu" class:active={!hidden}>
      <span /><span /><span />
    </div>
  </button>
</div>
{#if !hidden}
  <div
    transition:slide
    class="md:hidden absolute w-screen mobile-menu border bg-gray-100 text-gray-500"
  >
    <ul class="overflow-y-auto ">
      <li class:bg-rose-100={activeLink === '/'}>
        <a on:click={toggleMenu} href="/" class="block py-4 px-12 font-medium text-gray-800">Home</a
        >
      </li>

      <li>
        <button
          on:click={toggleGettingStarted}
          class="py-4 px-12 font-medium text-gray-800 flex justify-between w-full"
        >
          <span>Getting Started</span>
          {#if showGettingStarted}
            <img src={downArrow} alt="down arrow" />
          {:else}
            <img src={rightArrow} alt="right arrow" />
          {/if}
        </button>
      </li>

      {#if showGettingStarted}
        <ul transition:slide class="cursor-pointer bg-white">
          <li class:bg-rose-100={activeLink.includes('installation')}>
            <a on:click={toggleMenu} href="/docs/installation" class="block py-4 px-12 shadow-inner"
              >Installation</a
            >
          </li>
          <li class:bg-rose-100={activeLink.includes('basic-usage')}>
            <a on:click={toggleMenu} href="/docs/basic-usage" class="block py-4 px-12"
              >Basic Usage</a
            >
          </li>
          <li class:bg-rose-100={activeLink.includes('core-concepts')}>
            <a on:click={toggleMenu} href="/docs/core-concepts" class="block py-4 px-12"
              >Core Concepts</a
            >
          </li>
        </ul>
      {/if}

      <li>
        <button
          on:click={toggleGuides}
          class="py-4 px-12 font-medium text-gray-800 flex justify-between w-full"
        >
          <span>Guides</span>
          {#if showGuides}
            <img src={downArrow} alt="down arrow" />
          {:else}
            <img src={rightArrow} alt="right arrow" />
          {/if}
        </button>
      </li>

      {#if showGuides}
        <ul transition:slide class="cursor-pointer bg-white">
          <li class:bg-rose-100={activeLink.includes('custom-nodes')}>
            <a on:click={toggleMenu} href="/docs/custom-nodes" class="block py-4 px-12 shadow-inner"
              >Custom Nodes</a
            >
          </li>
          <li class:bg-rose-100={activeLink.includes('custom-edges')}>
            <a on:click={toggleMenu} href="/docs/custom-edges" class="block py-4 px-12"
              >Custom Edges</a
            >
          </li>
          <li class:bg-rose-100={activeLink.includes('pan-and-zoom')}>
            <a on:click={toggleMenu} href="/docs/pan-and-zoom" class="block py-4 px-12"
              >Pan and Zoom</a
            >
          </li>
          <li class:bg-rose-100={activeLink.includes('typescript')}>
            <a on:click={toggleMenu} href="/docs/typescript" class="block py-4 px-12">TypeScript</a>
          </li>
          <li class:bg-rose-100={activeLink.includes('testing')}>
            <a on:click={toggleMenu} href="/docs/testing" class="block py-4 px-12">Testing</a>
          </li>
          <li class:bg-rose-100={activeLink.includes('snap-to-grid')}>
            <a on:click={toggleMenu} href="/docs/snap-to-grid" class="block py-4 px-12">Snap-To-Grid</a>
          </li>
        </ul>
      {/if}

      <li class:bg-rose-100={activeLink.includes('blog')}>
        <a
          on:click={toggleMenu}
          target="_blank"
          href="https://medium.com/@alexander.zambrano/simplify-application-diagramming-with-svelvet-a8f664731243"
          class="block py-4 px-12 font-medium text-gray-800">Blog</a
        >
      </li>
      <li>
        <a
          on:click={toggleMenu}
          href="https://github.com/open-source-labs/Svelvet"
          target="_blank"
          class="block py-5 px-12 font-medium text-gray-800">Github</a
        >
      </li>
    </ul>
  </div>
  <!-- <div class="bg-white w-screen h-screen" /> -->
{/if}

<style>
  #navMenu > span {
    display: block;
    width: 28px;
    height: 2px;
    border-radius: 9999px;
    background-color: rgb(104, 104, 104);
  }

  #navMenu > span:not(:last-child) {
    margin-bottom: 7px;
  }

  #navMenu,
  #navMenu > span {
    transition: all 0.2s ease-in-out;
  }

  #navMenu.active {
    transition-delay: 0.4s;
    transform: rotate(45deg);
  }
  #navMenu.active > span:nth-child(2) {
    width: 0;
  }

  #navMenu.active > span:nth-child(1),
  #navMenu.active > span:nth-child(3) {
    transition-delay: 0.2s;
  }

  #navMenu.active > span:nth-child(1) {
    transform: translateY(9px);
  }

  #navMenu.active > span:nth-child(3) {
    transform: translateY(-9px) rotate(90deg);
  }
</style>
