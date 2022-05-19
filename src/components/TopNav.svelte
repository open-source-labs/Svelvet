<script lang="ts">
	import Logo from '../assets/logo.svelte';

	let activeLink = '';

	const setActiveLink = (e: MouseEvent) => {
		if (e.target.id) activeLink = e.target.id;
	};
</script>

<div class="static flex justify-between px-8 py-3 w-screen border-b h-16">
	<div class="flex space-x-5 items-center">
		<!-- <svelte:component this={Logo} /> -->
		<img src="src/assets/svelvet-logo.png" alt="Svelvet Logo" class="aspect-ratio-auto h-8" />
		<!-- <a href="/" class="text-xl font-medium">svelvet</a> -->
		<p class="text-xs rounded-full px-3 py-1 bg-gray-100 text-gray-500">v1.0.0</p>
		<!-- <button class="text-xs rounded-full px-3 py-1 bg-sky-100 text-sky-500"
			>Tailwind CSS v3.0 Just-in-Time all the time, colored shadows, scroll snap and more <span
				class="text-sky-300">></span
			>
		</button> -->
	</div>
	<nav class="space-x-7 text-sm text-gray-500 font-medium flex items-center">
		<a href="/" class="hover:text-rose-500">Home</a>
		<a href="/docs/installation" class="hover:text-rose-500">Docs</a>
		<a href="/examples" class="hover:text-rose-500">Examples</a>
		<a href="/blog" class="hover:text-rose-500">Blog</a>
		<a href="https://github.com/oslabs-beta/Svelvet" class="hover:text-rose-500 border-r pr-5"
			>Github</a
		>
		<input type="text" placeholder="Quick search" class="border rounded-full px-3" />
	</nav>
</div>

<style>
</style>
