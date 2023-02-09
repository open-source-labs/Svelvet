<script lang="ts">
  import { page } from '$app/stores'
  import { windowStore } from '../stores/windowStore'
  import { slide } from 'svelte/transition'

  let { scrollY } = windowStore
  let isMenu: boolean = false
  let showGetting: boolean = false
  let showGuides: boolean = false
  let showBlogs: boolean = false
  $: activeLink = `${$page.url.pathname}`

  const toggleMenu = () => isMenu = !isMenu
  const toggleGetting = () => showGetting = !showGetting
  const toggleGuides = () => showGuides = !showGuides
  const toggleBlogs = () => showBlogs = !showBlogs

  const clickOutside = (node) => {
    const handleClickOutside = ({target}) => {
      if (!node.contains(target)) {
        if (target.classList.contains('docs-btn')) return
        isMenu = false
      }
    }

    document.addEventListener('click', handleClickOutside)
    return {
      destroy() {
        document.removeEventListener('click', handleClickOutside)
      }
    } 
  }

  const blogs = [
    { version: '1.0', link: 'https://medium.com/@alexander.zambrano/simplify-application-diagramming-with-svelvet-a8f664731243' },
    { version: '2.0', link: 'https://medium.com/gitconnected/svelvet-2-0-c6b2059734a6' },
    { version: '4.0', link: 'https://medium.com/@MauricioACastro/svelvet-4-0-the-power-of-html-is-now-inside-your-nodes-3d96823096e3' },
    { version: '5.0', link: 'https://medium.com/@efergus1/svelvet-5-0-a-community-driven-update-cfcc93e7b7a7' }
  ]

</script>

<!-- Navbar -->
<nav class="w-screen sticky top-0 left-0 right-0 z-50 border-b bg-white" class:shadow-lg={$scrollY > 5} use:clickOutside>
  <div class="relative flex items-center justify-between py-4 {activeLink.includes('docs') ? 'px-6' : 'container'}">
    <div class="flex items-center justify-center space-x-6">
      <a href="/" class="flex items-center space-x-2">
        <img src="/assets/Logo 1.svg" alt="Logo" class="aspect-ratio-auto h-8" />
        <p class="text-3xl text-gray-700 font-nunito font-medium tracking-wide">svelvet</p>
      </a>
      <p class="text-xs rounded-full px-4 py-1 bg-rose-100 text-red-400 tracking-wider hidden md:block">v6.0.1</p>
    </div>
    
    <div class="hidden md:flex items-center space-x-10 font-medium text-sm text-gray-500">
      <a href="/docs/installation" id="docs" class="hover:text-rose-500" class:text-rose-500={activeLink.includes('docs')}>Docs</a>
      <a href="/playground" id="playground" class="hover:text-rose-500" class:text-rose-500={activeLink.includes('playground')}>REPL</a>
      <div class="dropdown relative overflow-hidden">
        <button class="hover:text-rose-500">Blogs
          <i class="fa fa-caret-down"></i>
        </button>
        <div class="dropdown-content">
        {#each blogs as blog }
          <a href={blog.link} target="_blank">Svelvet {blog.version}</a>
        {/each}
        </div>
      </div>
      <a href="https://github.com/open-source-labs/Svelvet" id="github" class="hover:text-rose-500" target="_blank">Github</a>
    </div>

    <div class="menuBtn md:hidden h-full flex flex-col space-y-2 cursor-pointer 
                {isMenu && 'delay-300 rotate-45'}" on:click={toggleMenu}>
      <span class="h-[2px] w-7 bg-gray-600 delay-200 {isMenu && 'translate-y-[10px]'}"></span>
      <span class="h-[2px] w-7 bg-gray-600 delay-300 {isMenu && 'w-0'}"></span>
      <span class="h-[2px] w-7 bg-gray-600 delay-200 {isMenu && '-translate-y-[10px] rotate-90'}"></span>
    </div>
  </div>

  {#if isMenu}
    <div class="md:hidden flex flex-col bg-gray-100 text-gray-700" transition:slide>
      <button class="docs-btn w-full flex justify-between p-4" on:click={toggleGetting}>
        <span class="docs-btn">Getting Started</span>
        {#if !showGetting}
          <img src="/assets/arrow-right.svg" alt="right arrow" class="docs-btn" />
        {:else}
          <img src="/assets/arrow-down.svg" alt="down arrow" class="docs-btn" />
        {/if}
      </button>
      {#if showGetting}
        <div transition:slide class="w-screen flex flex-col">
          <a href="/docs/installation" class:bg-rose-100={activeLink.includes('installation')} class="bg-white py-4 px-8">Installation</a>
          <a href="/docs/basic-usage" class:bg-rose-100={activeLink.includes('basic-usage')} class="bg-white py-4 px-8">Basic Usage</a>
          <a href="/docs/core-concepts" class:bg-rose-100={activeLink.includes('core-concepts')} class="bg-white py-4 px-8">Core Concepts</a>
        </div>
      {/if}
      <button class="docs-btn w-full flex justify-between p-4" on:click={toggleGuides}>
        <span class="docs-btn">Guides</span>
        {#if !showGuides}
          <img src="/assets/arrow-right.svg" alt="right arrow" class="docs-btn" />
        {:else}
          <img src="/assets/arrow-down.svg" alt="down arrow" class="docs-btn" />
        {/if}
      </button>
      {#if showGuides}
        <div transition:slide class="w-screen flex flex-col">
          <a href="/docs/custom-nodes" class:bg-rose-100={activeLink.includes('custom-nodes')} class="bg-white py-4 px-8">Custom Nodes</a>
          <a href="/docs/custom-edges" class:bg-rose-100={activeLink.includes('custom-edges')} class="bg-white py-4 px-8">Custom Edges</a>
          <a href="/docs/typeScript" class:bg-rose-100={activeLink.includes('typeScript')} class="bg-white py-4 px-8">TypeScript</a>
          <a href="/docs/testing" class:bg-rose-100={activeLink.includes('testing')} class="bg-white py-4 px-8">Testing</a>
          <a href="/docs/snap-to-grid" class:bg-rose-100={activeLink.includes('snap-to-grid')} class="bg-white py-4 px-8">Snap-to-Grid</a>
          <a href="/docs/HTML-Docs" class:bg-rose-100={activeLink.includes('HTML-docs')} class="bg-white py-4 px-8">HTML-Docs</a>
          <a href="/docs/Interactive-Nodes" class:bg-rose-100={activeLink.includes('Interactive-Nodes')} class="bg-white py-4 px-8">Interactive Node Linking & Creation</a>
          <a href="/docs/Custom-Svelte" class:bg-rose-100={activeLink.includes('Custom-Svelte')} class="bg-white py-4 px-8">Custom Svelte Components</a>
          <a href="/docs/Minimap" class:bg-rose-100={activeLink.includes('Minimap')} class="bg-white py-4 px-8">Minimap</a>
          <a href="/docs/Initial-Zoom-Location" class:bg-rose-100={activeLink.includes('Initial-Zoom-Location')} class="bg-white py-4 px-8">Initial Zoom & Location</a>
          <a href="/docs/Node Classes" class:bg-rose-100={activeLink.includes('Node-Classes')} class="bg-white py-4 px-8">Node Classes</a>
          <a href="/docs/importDiagrams" class:bg-rose-100={activeLink.includes('importDiagrams')} class="bg-white py-4 px-8">Importing & Exporting Diagrams</a>
          <a href="/docs/boundary" class:bg-rose-100={activeLink.includes('boundary')} class="bg-white py-4 px-8">Diagram Boundary</a>
          <a href="/docs/editNodes" class:bg-rose-100={activeLink.includes('editNodes')} class="bg-white py-4 px-8">Interactive Editable Nodes</a>
          <a href="/docs/editNodes" class:bg-rose-100={activeLink.includes('editNodes')} class="bg-white py-4 px-8">Interactive Editable Nodes</a>
          <a href="/docs/delete" class:bg-rose-100={activeLink.includes('delete')} class="bg-white py-4 px-8">Deletable Nodes</a>
          <a href="/docs/ResizableNodes" class:bg-rose-100={activeLink.includes('ResizableNodes')} class="bg-white py-4 px-8">Resizable Nodes</a>
          <a href="/docs/DynamicAnchor" class:bg-rose-100={activeLink.includes('DynamicAnchor')} class="bg-white py-4 px-8">Dynamic Anchor</a>
          <a href="/docs/CustomAnchorPosition" class:bg-rose-100={activeLink.includes('CustomAnchorPosition')} class="bg-white py-4 px-8">Custom Anchor Position</a>
          <a href="/docs/AdaptiveAnchors" class:bg-rose-100={activeLink.includes('AdaptiveAnchors')} class="bg-white py-4 px-8">Adaptive Anchors</a>
          <a href="/docs/editEdge" class:bg-rose-100={activeLink.includes('editEdge')} class="bg-white py-4 px-8">Interactive Editable Edges</a>
          <a href="/docs/Unfold-collapse" class:bg-rose-100={activeLink.includes('Unfold-collapse')} class="bg-white py-4 px-8">Unfold and Collapse</a>
        </div>
      {/if}
      <button class="docs-btn w-full flex justify-between p-4" on:click={toggleBlogs}>
        <span class="docs-btn">Blogs</span>
        {#if !showBlogs}
          <img src="/assets/arrow-right.svg" alt="right arrow" class="docs-btn" />
        {:else}
          <img src="/assets/arrow-down.svg" alt="down arrow" class="docs-btn" />
        {/if}
      </button>
      {#if showBlogs}
        <div transition:slide class="w-screen flex flex-col">
          {#each blogs as blog }
            <a href={blog.link} target="_blank" class="bg-white py-4 px-8">Svelvet {blog.version}</a>
          {/each}
        </div>
      {/if}
      <a href="/playground" id="playground" class="w-full p-4">REPL</a>
      <a href="https://github.com/open-source-labs/Svelvet" id="github" class="w-full p-4" target="_blank">Github</a>
    </div>
  {/if}
</nav>

<style>

/* Dropdown content (hidden by default) */
.dropdown-content {
  display: none;
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
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

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
  display: block;
}

.menuBtn,
.menuBtn > span{
  transition: all .2s ease-in-out;
}
</style>
