<!-- Complete sidebar rendering with routes -->
<script lang="ts">
  import { page } from '$app/stores';

  const gettingStartedLinks = [
    ['Installation', 'installation'],
    ['Basic Usage', 'basic-usage'],
    ['Core Concepts', 'core-concepts']
  ];

  const guideLinks = [
    ['Custom Nodes', 'custom-nodes'],
    ['Custom Edges', 'custom-edges'],
    ['Panning and Zooming', 'pan-and-zoom'],
    ['Usage with Typescript', 'typescript'],
    ['Testing', 'testing'],
    ['CSS-Background', 'CSS-Background'],
    ['Node-Grouping', 'node-grouping'],
    ['Snap-To-Grid', 'snap-to-grid'],
    ['HTML-Docs', 'HTML-Docs'],
    ['Interactive Node Linking & Creation', 'Interactive-Nodes'],
    ['Custom Svelte Components', 'Custom-Svelte'],
    ['Minimap', 'Minimap'],
    ['Initial Zoom & Location', 'Initial-Zoom-Location'],
    ['Node Classes', 'Node-Classes'],
    ['Importing & Exporting Diagrams', 'importDiagrams'],
    ['Diagram Boundary', 'boundary'],
    ['Interactive Editable Nodes', 'editNodes'],
    ['Deletable Nodes', 'delete'],
    ['Resizable Nodes', 'ResizableNodes'],
    ['Dynamic Anchors', 'DynamicAnchor'],
    ['Custom Anchor Position', 'CustomAnchorPosition'],
    ['Adaptive Anchors', 'AdaptiveAnchors'],
    ['Interactive Editable Edges', 'editEdge'],
    ['Unfold and Collapse', 'Unfold-collapse']
  ];

  // const communityLinks = [
  //   [
  //     'Blog',
  //     'https://medium.com/@alexander.zambrano/simplify-application-diagramming-with-svelvet-a8f664731243'
  //   ],
  //   ['GitHub', 'https://github.com/open-source-labs/Svelvet'],
  //   ['LinkedIn', 'https://www.linkedin.com/company/svelvet/'],
  //   ['Twitter', 'https://twitter.com/Svelvet_OSLabs'],
  //   ['Stack Overflow', 'https://stackoverflow.com/questions/tagged/svelte']
  // ];

  $: activeLink = `${$page.url.pathname}`;
</script>

<!-- Ask Team: about implementation of foreach loop for links/routes -->
<div class="hidden md:block">
  <div class="flex flex-col my-5 text-sm w-full">
    <p class="font-medium text-gray-700 leading-9">Getting Started</p>
    <div class="flex flex-col leading-9 text-gray-500 ">
      {#each gettingStartedLinks as link}
        <a
          id={link[0]}
          href="/docs/{link[1]}"
          class="border-l px-4 hover:border-rose-300  {activeLink.includes(link[1])
            ? 'text-rose-500 hover:text-rose-500 border-rose-300'
            : 'hover:text-gray-700 border-gray-100'}">{link[0]}</a
        >
      {/each}
    </div>
  </div>
  <div class="flex flex-col my-5 text-sm">
    <p class="font-medium text-gray-700 leading-9">Guides</p>
    <div class="flex flex-col leading-9 text-gray-500 ">
      {#each guideLinks as link}
        <a
          id={link[0]}
          href="/docs/{link[1]}"
          class="border-l px-4 hover:border-rose-300  {activeLink.includes(link[1])
            ? 'text-rose-500 hover:text-rose-500 border-rose-300'
            : 'hover:text-gray-700 border-gray-100'}">{link[0]}</a
        >
      {/each}
    </div>
  </div>

  <!-- Uncomment Once API Docs are Implemented -->

  <!-- <div class="flex flex-col my-5 text-sm">
    <a href="/community/forum" class="font-medium text-gray-700 leading-9">Community</a>
    <div class="flex flex-col leading-9 text-gray-500 ">
      {#each communityLinks as link}
        <a
          id={link[0]}
          href={link[1]}
          target="_blank"
          class="border-l px-4 hover:border-rose-300  {activeLink.includes(link[1])
            ? 'text-rose-500 hover:text-rose-500 border-rose-300'
            : 'hover:text-gray-700 border-gray-100'}">{link[0]}</a
        >
      {/each}
    </div>
  </div> -->
</div>
