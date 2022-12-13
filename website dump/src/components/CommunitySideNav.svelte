<!-- Complete sidebar rendering with routes -->
<script lang="ts">
  import { page } from '$app/stores';

  const communityLinks = [
    // ['About', 'about'],
    ['Discussion', 'forum'],
    ['Templates', 'templates']
  ];

  $: activeLink = `${$page.url.pathname}`;
</script>

<!-- Ask Team: about implementation of foreach loop for links/routes -->
<div class="hidden md:block">
  <div class="flex flex-col my-5 text-sm">
    <a href="/community/forum" class="font-medium text-gray-700 leading-9">Community</a>
    <div class="flex flex-col leading-9 text-gray-500 ">
      {#each communityLinks as link}
        <a
          id={link[0]}
          href="/community/{link[1]}"
          class="border-l px-4 hover:border-rose-300  {activeLink.includes(link[1])
            ? 'text-rose-500 hover:text-rose-500 border-rose-300'
            : 'hover:text-gray-700 border-gray-100'}">{link[0]}</a
        >
      {/each}
    </div>
  </div>
</div>
