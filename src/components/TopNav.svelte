<script lang="ts">
	import logo from '../assets/Logo 1.svg';
	import { page } from '$app/stores';
	import MobileHomeNav from './MobileHomeNav.svelte';
	import MobileDocsNav from './MobileDocsNav.svelte';

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
		<p class="text-xs rounded-full px-4 py-1 bg-rose-100 text-red-400 tracking-wider">v0.0.7</p>
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
			target="_blank"
			href="https://medium.com/@alexander.zambrano/simplify-application-diagramming-with-svelvet-a8f664731243"
			id="blog"
			class="hover:text-rose-500 {activeLink.includes('blog') ? 'text-rose-500' : ''}">Blog</a
		>
		<a
			href="https://github.com/oslabs-beta/Svelvet"
			id="github"
			target="_blank"
			class="hover:text-rose-500 border-r pr-5">Github</a
		>
	</nav>
</div>

<style>
</style>
