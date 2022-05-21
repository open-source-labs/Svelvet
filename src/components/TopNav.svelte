<script lang="ts">
	import logo from '../assets/Logo 1.svg';
	import { page } from '$app/stores';
	// let activeLink = 'home';
	$: activeLink = `${$page.url.pathname}`;
</script>

<div class="static flex justify-between px-8 py-3 w-screen border-b h-16 bg-white">
	<div class="flex items-center justify-center">
		<!-- <svelte:component this={Logo} /> -->
		<img src={logo} alt="Logo" class="aspect-ratio-auto h-8" />
		<a
			id="home"
			href="/"
			on:click={() => {
				activeLink = '/';
			}}
			class="text-3xl text-gray-700 font-nunito font-medium tracking-wide ml-2 mr-6">svelvet</a
		>
		<p class="text-xs rounded-full px-4 py-1 bg-rose-100 text-red-400 tracking-wider">v0.0.5</p>
	</div>
	<nav class="space-x-7 text-sm text-gray-500 font-medium flex items-center">
		<a href="/" id="home" class="hover:text-rose-500 {activeLink === '/' ? 'text-rose-500' : ''}"
			>Home</a
		>
		<a
			href="/docs/installation"
			id="docs"
			class="hover:text-rose-500 {activeLink.includes('docs') ? 'text-rose-500' : ''}">Docs</a
		>
		<!-- <a
			href="/examples"
			id="examples"
			class="hover:text-rose-500 {activeLink.includes('examples') ? 'text-rose-500' : ''}"
			>Examples</a
		> -->
		<a
			href="/blog"
			id="blog"
			class="hover:text-rose-500 {activeLink.includes('blog') ? 'text-rose-500' : ''}">Blog</a
		>
		<a
			href="https://github.com/oslabs-beta/Svelvet"
			id="github"
			target="_blank"
			class="hover:text-rose-500 border-r pr-5">Github</a
		>
		<input type="text" placeholder="Quick search" class="border rounded-full px-3" />
	</nav>
</div>

<style>
</style>
