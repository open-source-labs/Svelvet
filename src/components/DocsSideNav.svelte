<script lang="ts">
	import { page } from '$app/stores';

	const gettingStartedLinks = [
		['Installation', 'installation'],
		['Basic Usage', 'basic-usage'],
		['Core Concepts', 'core-concepts']
	];

	const guideLinks = [
		['Custom nodes', 'custom-nodes'],
		['Sub Flows', 'subflows'],
		['Panning and Zooming', 'pan-and-zoom'],
		['Usage with Typescript', 'typescript'],
		['Theming', 'theming'],
		['Testing', 'testing']
	];

	const APIReferenceLinks = [
		['Nodes', 'api-nodes'],
		['Edges', 'api-edges']
	];

	$: activeLink = `${$page.url.pathname}`;
</script>

<!-- <nav class="border-r h-screen w-80 px-8 overflow-y-auto"> -->
<!-- {#if $page.url.pathname === '/docs'} -->
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
<div class="flex flex-col my-5 text-sm">
	<p class="font-medium text-gray-700 leading-9">API Reference</p>
	<div class="flex flex-col leading-9 text-gray-500 ">
		{#each APIReferenceLinks as link}
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
<!-- {/if} -->

<!-- Examples page Side Nav
	{#if $page.url.pathname === '/examples'}
		<div class="flex flex-col my-5 text-sm">
			<a href="/basic-usage" class="font-medium text-gray-700 leading-9">Basic Usage</a>
		</div>
		<div class="flex flex-col my-5 text-sm">
			<p class="font-medium text-gray-700 leading-9">Nodes</p>
			<div class="flex flex-col leading-9 text-gray-500 ">
				{#each nodesLinks as link}
					<a
						id={link[0]}
						href={link[1]}
						class="border-l border-gray-100 px-4 hover:border-rose-300 hover:text-gray-700"
						>{link[0]}</a
					>
				{/each}
			</div>
		</div>
		<div class="flex flex-col my-5 text-sm">
			<p class="font-medium text-gray-700 leading-9">Edges</p>
			<div class="flex flex-col leading-9 text-gray-500 ">
				{#each edgesLinks as link}
					<a
						id={link[0]}
						href={link[1]}
						class="border-l border-gray-100 px-4 hover:border-rose-300 hover:text-gray-700"
						>{link[0]}</a
					>
				{/each}
			</div>
		</div>
	{/if} -->

<!-- </nav> -->
