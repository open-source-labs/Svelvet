<script>
</script>

<svelte:head>
	<title>Svelvet</title>
</svelte:head>
<div class="css-blurry-gradient" />

<div class="flex flex-col justify-center items-center w-auto my-56 mx-16 text-center ">
	<h1 class="text-6xl text-center font-bold text-gray-800 max-w-screen-lg">
		Mapping out your ideas with Svelte has never been easier
	</h1>
	<p class="text-lg mx-16 my-8 text-gray-500">
		A light-weight Svelte component library for building node-based editors and interactive diagrams
	</p>
	<a
		href="/docs/installation"
		class="border rounded-full px-6 py-3 hover:ease-in duration-100 hover:text-rose-400 hover:bg-transparent bg-rose-400 text-white border-rose-400"
		>Get Started</a
	>
</div>
<div class="h-96 w-screen bg-gradient-to-r from-[#F66F52] to-rose-400 text-white">
	<div class="flex h-full m-24">
		<div class="w-1/2 h-full flex flex-col justify-center">
			<h3 class="text-4xl font-bold mb-4">Beautiful flow diagrams</h3>
			<p class="mb-4 text-gray-100">
				Svelvet allows you to easily create intuitive flow diagrams using pre-built nodes and edges,
				all with seamless zooming and panning.
			</p>
			<a
				href="/docs/installation"
				class=" w-fit border border-white mt-5 py-1 px-4 rounded-full hover:ease-in duration-100 hover:text-white hover:bg-transparent bg-white text-rose-700 "
				>Documentation</a
			>
		</div>
		<div class="w-1/2 h-full flex flex-col justify-center text-center">
			insert beautiful flow diagram here
		</div>
	</div>
</div>
<div class="h-96 w-screen ">
	<div class="flex h-full m-24">
		<div class="w-1/2 h-full flex flex-col justify-center">insert customized flow diagram</div>
		<div class="w-1/2 h-full flex flex-col justify-center">
			<h3 class="text-4xl font-bold mb-4 text-gray-700">Highly Customizable</h3>
			<p class="mb-4 text-gray-500">
				Choose from different edge types, add animations, and create custom nodes. Within your
				nodes, you can render anything you want!
			</p>
			<a
				href="/docs/installation"
				class=" w-fit border mt-5 py-1 px-4 rounded-full hover:ease-in duration-100 hover:text-rose-400 hover:bg-transparent bg-rose-400 text-white border-rose-400"
				>Documentation</a
			>
		</div>
	</div>
</div>
<footer class="flex justify-around mt-40 py-10 border-t text-sm">
	<div class="flex flex-col space-y-3 text-gray-600">
		<a href="/" class="text-gray-700 font-semibold">Getting Started</a>
		<a href="/">Installation</a>
		<a href="/">Core Concepts</a>
		<a href="/">Themes</a>
		<a href="/">Custom Nodes</a>
		<a href="/">Panning and Zooming</a>
	</div>
	<div class="flex flex-col space-y-3 text-gray-600">
		<a href="/" class="text-gray-700 font-semibold">Core Concepts</a>
		<a href="/">Installation</a>
		<a href="/">Core Concepts</a>
		<a href="/">Themes</a>
		<a href="/">Custom Nodes</a>
		<a href="/">Panning and Zooming</a>
	</div>
	<div class="flex flex-col space-y-3 text-gray-600">
		<a href="/" class="text-gray-700 font-semibold">Customization</a>
		<a href="/">Installation</a>
		<a href="/">Core Concepts</a>
		<a href="/">Themes</a>
		<a href="/">Custom Nodes</a>
		<a href="/">Panning and Zooming</a>
	</div>
	<div />
</footer>

<style>
	.css-blurry-gradient {
		position: absolute;
		top: 60%;
		left: 50%;
		transform: translate(-50%, 0%);
		width: 800px;
		height: 800px;
		border-radius: 50% 22% 40% 80%;
		filter: blur(120px);
		background: radial-gradient(circle at 50% 50%, rgb(247, 85, 56), rgba(205, 203, 211, 0));
		opacity: 0.3;
		z-index: -1;
	}
</style>
