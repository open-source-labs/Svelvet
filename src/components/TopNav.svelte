<script lang="ts">
	import logo from '../assets/Logo 1.svg';
	import { page } from '$app/stores';
	import { fly } from 'svelte/transition';
	// let activeLink = 'home';
	$: activeLink = `${$page.url.pathname}`;

	let hidden = true;
	const toggleMenu = () => {
		hidden = !hidden;
	};
</script>

<!-- Toggle Mobile Navbar -->
<div class="md:hidden flex justify-between px-8 py-3 w-screen border-b h-16 bg-white">
	<div class="flex items-center">
		<img src={logo} alt="Logo" class="aspect-ratio-auto h-8" />
		<a
			id="home"
			href="/"
			on:click={() => {
				activeLink = '/';
			}}
			class="text-3xl text-gray-700 font-nunito font-medium tracking-wide ml-2 mr-6">svelvet</a
		>
	</div>
	<button class="outline-none mobile-menu-button pl-8 " on:click={toggleMenu}>
		<svg
			class="w-6 h-6 text-gray-500"
			x-show="!showMenu"
			fill="none"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path d="M4 6h16M4 12h16M4 18h16" />
		</svg>
	</button>
</div>
<div
	class:hidden
	class="md:hidden absolute w-screen mobile-menu border drop-shadow-md px-8 bg-gray-100 text-gray-700"
>
	<ul class="text-center">
		<li>
			<a on:click={toggleMenu} href="/" class="block py-6">Home</a>
		</li>
		<li>
			<a on:click={toggleMenu} href="/docs" class="block py-6">Documentation</a>
		</li>
		<li>
			<a on:click={toggleMenu} href="/blog" class="block py-6">Blog</a>
		</li>
		<li>
			<a
				on:click={toggleMenu}
				href="https://github.com/oslabs-beta/Svelvet"
				target="_blank"
				class="block py-6">Github</a
			>
		</li>
	</ul>
</div>

<!-- Navbar -->
<div class="static hidden md:flex justify-between px-8 py-3 w-screen border-b h-16 bg-white">
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
