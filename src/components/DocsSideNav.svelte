<script lang="ts">
	const gettingStartedLinks = [
		['Installation', '/installation'],
		['Core Concepts', '/core-concepts'],
		['Plugin Components', '/plugin-components']
	];

	const guideLinks = [
		['Custom nodes', '/custom-nodes'],
		['Sub Flows', '/subflows'],
		['Uncontrolled Flow', '/uncontrolled-flow'],
		['Panning and Zooming', '/pan-and-zoom'],
		['Usage with Typescript', '/typescript'],
		['Theming', '/theming']
	];

	const APIReferenceLinks = [
		['Nodes', '/nodes'],
		['Edges', '/edges']
	];

	let activeLink = 'Installation';

	const setActiveLink = (e: MouseEvent) => {
		if (e.target.id) activeLink = e.target.id;
	};
</script>

<!-- <nav class="border-r h-screen w-80 px-8 overflow-y-auto"> -->
<!-- {#if $page.url.pathname === '/docs'} -->
<div class="flex flex-col my-5 text-sm">
	<p class="font-medium text-gray-700 leading-9">Getting Started</p>
	<div class="flex flex-col leading-9 text-gray-500 ">
		{#each gettingStartedLinks as link}
			<a
				on:click={setActiveLink}
				id={link[0]}
				href="/docs{link[1]}"
				class="border-l px-4 hover:border-rose-300  {activeLink === link[0]
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
				on:click={setActiveLink}
				id={link[0]}
				href="/docs{link[1]}"
				class="border-l px-4 hover:border-rose-300  {activeLink === link[0]
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
				on:click={setActiveLink}
				id={link[0]}
				href="/docs{link[1]}"
				class="border-l px-4 hover:border-rose-300  {activeLink === link[0]
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
<style>
	a {
		/* font-family: Inter; */
	}
</style>
