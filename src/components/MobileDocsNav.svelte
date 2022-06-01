<script lang="ts">
	import logo from '../assets/Logo 1.svg';
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';

	$: activeLink = `${$page.url.pathname}`;

	let hidden = true;

	const toggleMenu = () => {
		hidden = !hidden;
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
		class="md:hidden absolute w-screen mobile-menu border drop-shadow-md  bg-gray-100 text-gray-500"
	>
		<ul class="text-center overflow-y-auto ">
			<li class:bg-rose-100={activeLink === '/'}>
				<a on:click={toggleMenu} href="/" class="block py-5 font-medium text-gray-800">Home</a>
			</li>

			<li>
				<p class="block py-5 font-medium text-gray-800">Getting Started</p>
			</li>
			<li class:bg-rose-100={activeLink.includes('installation')}>
				<a on:click={toggleMenu} href="/docs/installation" class="block py-5">Installation</a>
			</li>
			<li class:bg-rose-100={activeLink.includes('basic-usage')}>
				<a on:click={toggleMenu} href="/docs/basic-usage" class="block py-5">Basic Usage</a>
			</li>
			<li class:bg-rose-100={activeLink.includes('core-concepts')}>
				<a on:click={toggleMenu} href="/docs/core-concepts" class="block py-5">Core Concepts</a>
			</li>

			<li>
				<p class="block py-5 font-medium text-gray-800">Guides</p>
			</li>
			<li class:bg-rose-100={activeLink.includes('custom-nodes')}>
				<a on:click={toggleMenu} href="/docs/custom-nodes" class="block py-5">Custom Nodes</a>
			</li>
			<li class:bg-rose-100={activeLink.includes('pan-and-zoom')}>
				<a on:click={toggleMenu} href="/docs/pan-and-zoom" class="block py-5">Pan and Zoom</a>
			</li>
			<li class:bg-rose-100={activeLink.includes('typescript')}>
				<a on:click={toggleMenu} href="/docs/typescript" class="block py-5">TypeScript</a>
			</li>
			<li class:bg-rose-100={activeLink.includes('testing')}>
				<a on:click={toggleMenu} href="/docs/testing" class="block py-5">Testing</a>
			</li>

			<li class:bg-rose-100={activeLink.includes('blog')}>
				<a
					on:click={toggleMenu}
					target="_blank"
					href="https://medium.com/@alexander.zambrano/simplify-application-diagramming-with-svelvet-a8f664731243"
					class="block py-5 font-medium text-gray-800">Blog</a
				>
			</li>
			<li>
				<a
					on:click={toggleMenu}
					href="https://github.com/oslabs-beta/Svelvet"
					target="_blank"
					class="block py-5 font-medium text-gray-800">Github</a
				>
			</li>
		</ul>
	</div>
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
