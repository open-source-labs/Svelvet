<script lang="ts">
	import logo from '../assets/svelvet-logo.png';
	let activeLink = 'home';

	const setActiveLink = (e: MouseEvent) => {
		if (e.target.id) activeLink = e.target.id;
	};
</script>

<div class="static flex justify-between px-8 py-3 w-screen border-b h-16 bg-white">
	<div class="flex items-center justify-center">
		<!-- <svelte:component this={Logo} /> -->
		<img src={logo} alt="Logo" class="aspect-ratio-auto h-8" />
		<a href="/" class="text-3xl font-medium tracking-wide ml-3 mr-6">svelvet</a>
		<p class="text-xs rounded-full px-4 py-1 bg-rose-100 text-red-400 tracking-wider">v1.0.0</p>
	</div>
	<nav class="space-x-7 text-sm text-gray-500 font-medium flex items-center">
		<a
			href="/"
			id="home"
			class="hover:text-rose-500 {activeLink === 'home' ? 'text-rose-500' : ''}"
			on:click={setActiveLink}>Home</a
		>
		<a
			href="/docs/installation"
			id="docs"
			class="hover:text-rose-500 {activeLink === 'docs' ? 'text-rose-500' : ''}"
			on:click={setActiveLink}>Docs</a
		>
		<a
			href="/examples"
			id="examples"
			class="hover:text-rose-500 {activeLink === 'examples' ? 'text-rose-500' : ''}"
			on:click={setActiveLink}>Examples</a
		>
		<a
			href="/blog"
			id="blog"
			class="hover:text-rose-500 {activeLink === 'blog' ? 'text-rose-500' : ''}"
			on:click={setActiveLink}>Blog</a
		>
		<a
			href="https://github.com/oslabs-beta/Svelvet"
			id="github"
			class="hover:text-rose-500 border-r pr-5">Github</a
		>
		<input type="text" placeholder="Quick search" class="border rounded-full px-3" />
	</nav>
</div>

<style>
</style>
