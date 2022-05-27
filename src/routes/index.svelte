<script>
</script>

<svelte:head>
	<title>Svelvet</title>
</svelte:head>
<div class="css-blurry-gradient" />

<div class="flex flex-col justify-center items-center w-auto my-28 md:my-56 mx-16 text-center ">
	<h1 class="text-4xl md:text-6xl text-center font-bold text-gray-800 max-w-screen-lg">
		Mapping out your ideas with Svelte has never been easier
	</h1>
	<p class="text-lg md:mx-16 my-8 text-gray-500">
		A light-weight Svelte component library for building node-based editors and interactive diagrams
	</p>
	<a
		href="/docs/installation"
		class="border rounded-full px-6 py-3 hover:ease-in duration-100 hover:text-rose-400 hover:bg-transparent bg-rose-400 text-white border-rose-400"
		>Get Started</a
	>
</div>
<div class="h-[600px] md:h-[420px] w-screen bg-gradient-to-r from-[#F66F52] to-rose-400 text-white">
	<div class="flex flex-col md:flex-row h-full m-12 md:m-24 md:gap-10">
		<div class="w-full md:w-1/2 h-full flex flex-col justify-center">
			<h3 class="text-4xl font-bold mb-4 mt-8 text-center md:text-right">
				Beautiful flow diagrams
			</h3>
			<p class="mb-4 text-gray-100 text-center md:text-right">
				Svelvet allows you to easily create intuitive flow diagrams using pre-built nodes and edges,
				all with seamless zooming and panning.
			</p>
			<a
				href="/docs/installation"
				class="hidden md:flex self-end w-fit border border-white mt-5 py-1 px-4 rounded-full hover:ease-in duration-100 hover:text-white hover:bg-transparent bg-white text-rose-700 "
				>Documentation</a
			>
		</div>
		<div
			class="w-full md:w-1/2 h-[350px] md:h-full mb-8 md:py-12 flex flex-col justify-center text-center "
		>
			<iframe
				src="https://codesandbox.io/embed/recursing-rgb-lde6vt?autoresize=1&codemirror=1&fontsize=12&hidenavigation=1&module=%2FApp.svelte&theme=light&view=preview&editorsize=50&hidedevtools=1"
				style="width:100%; height:400px; border:0; border-radius: 8px; overflow:hidden;"
				title="recursing-rgb-lde6vt"
				allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
				sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
			/>
		</div>
	</div>
</div>
<div class="h-[600px] md:h-[420px] w-screen">
	<div class="flex flex-col-reverse md:flex-row h-full m-12 md:m-24 md:gap-10">
		<div
			class="w-full md:w-1/2 h-[350px] md:h-full mb-8 md:py-12 flex flex-col justify-center text-center "
		>
			<iframe
				src="https://codesandbox.io/embed/recursing-rgb-lde6vt?autoresize=1&codemirror=1&fontsize=12&hidenavigation=1&module=%2FApp.svelte&theme=light&view=preview&editorsize=50&hidedevtools=1"
				style="width:100%; height:400px; border:0; border-radius: 8px; overflow:hidden;"
				title="recursing-rgb-lde6vt"
				allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
				sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
			/>
		</div>
		<div class="w-full md:w-1/2 h-full flex flex-col justify-center">
			<h3 class="text-4xl font-bold mb-4 mt-8 text-center md:text-left text-gray-700">
				Highly Customizable
			</h3>
			<p class="mb-4 text-gray-500 text-center md:text-left">
				Choose from different edge types, add animations, and create custom nodes. Within your
				nodes, you can render anything you want!
			</p>
			<a
				href="/docs/installation"
				class="hidden md:flex  w-fit border mt-5 py-1 px-4 rounded-full hover:ease-in duration-100 hover:text-rose-400 hover:bg-transparent bg-rose-400 text-white border-rose-400"
				>Documentation</a
			>
		</div>
	</div>
</div>
<div class="h-[420px] w-screen bg-gradient-to-r from-[#F66F52] to-rose-400 text-white">
	<div class=" h-full m-12 md:m-24">
		<div class=" h-full w-full flex flex-col justify-center">
			<h3 class="text-4xl font-bold mb-4 text-center">Get In Contact</h3>
			<p class="mb-4 text-gray-100 text-center">in progress</p>
			<a
				href="/docs/installation"
				class="self-center w-fit border border-white mt-5 py-1 px-4 rounded-full hover:ease-in duration-100 hover:text-white hover:bg-transparent bg-white text-rose-700 "
				>Contact Us</a
			>
		</div>
	</div>
</div>

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

	@media (max-width: 768px) {
		.css-blurry-gradient {
			opacity: 0.6;
		}
	}
</style>
