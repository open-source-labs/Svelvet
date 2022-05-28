<script>
	import Svelvet from '$lib/Containers/Svelvet/index.svelte';
	const initialNodes = [
		{
			id: 1,
			type: 'input',
			position: { x: 215, y: 40 },
			data: { label: 'Input Node' },
			width: 175,
			height: 40,
			bgColor: 'white'
		},
		{
			id: 2,
			type: 'default',
			position: { x: 380, y: 160 },
			data: { label: 'Default Node' },
			width: 175,
			height: 40,
			bgColor: 'white'
		},
		{
			id: 3,
			type: 'output',
			position: { x: 215, y: 260 },
			data: { label: 'Output Node' },
			width: 175,
			height: 40,
			bgColor: 'white'
		},
		{
			id: 4,
			type: 'output',
			position: { x: 50, y: 160 },
			data: { label: 'Drag me!' },
			width: 175,
			height: 40,
			bgColor: 'white'
		},
		{
			id: 5,
			type: 'output',
			position: { x: 380, y: 360 },
			data: { label: 'Custom Node' },
			width: 175,
			height: 40,
			bgColor: '#C8FFC7'
		},
		{
			id: 6,
			type: 'output',
			position: { x: 97.5, y: 360 },
			data: { label: 'Important Square!' },
			width: 80,
			height: 80,
			borderColor: '#FF4121',
			bgColor: 'white',
			textColor: '#FF4121'
		}
	];

	const initialEdges = [
		{ id: 'e1-2', source: 1, target: 2, label: 'edge label' },
		{ id: 'e2-3', source: 2, target: 3, animate: true },
		{ id: 'e1-4', source: 1, target: 4 },
		{ id: 'e2-5', source: 2, target: 5, label: 'animated edge', animate: true },
		{ id: 'e2-5', source: 4, target: 6, type: 'straight' },
		{ id: 'e2-5', source: 3, target: 6 }
	];
</script>

<svelte:head>
	<title>Svelvet</title>
</svelte:head>
<div class="css-blurry-gradient" />

<div class="flex flex-col justify-center items-center w-auto my-24 md:my-48 mx-8 text-center ">
	<h1 class="text-4xl md:text-6xl text-center font-bold text-gray-800 max-w-screen-lg">
		Mapping out your ideas with Svelte has never been easier
	</h1>
	<p class="text-lg md:mx-16 my-8 text-gray-500">
		A light-weight Svelte component library for building node-based editors and interactive diagrams
	</p>
	<a
		href="/docs/installation"
		class="border shadow-lg hover:shadow-transparent rounded-full px-6 py-3 hover:ease-in duration-100 hover:text-rose-400 hover:bg-transparent bg-rose-400 text-white border-rose-400"
		>Get Started</a
	>
</div>
<div class="h-[700px] md:h-[600px] w-screen bg-gradient-to-r from-[#F66F52] to-rose-400 text-white">
	<div class="flex flex-col md:flex-row h-full m-12 md:m-24 md:gap-10">
		<div class="w-full md:w-1/2 h-full flex flex-col justify-center">
			<h3 class="text-4xl font-bold mb-4 mt-8 text-center md:text-right">
				Beautiful and Customizable
			</h3>
			<p class="mb-4 text-gray-100 text-center md:text-right">
				Svelvet allows you to easily create intuitive flow diagrams using pre-built components with
				seamless zooming and panning, draggable interactivity, customizable edges and nodes and
				more!
			</p>
			<a
				href="/docs/custom-nodes"
				class="hidden shadow-md hover:shadow-transparent md:flex self-end w-fit border border-white mt-5 py-1 px-4 rounded-full hover:ease-in duration-100 hover:text-white hover:bg-transparent bg-white text-rose-700 "
				>See How to Customize</a
			>
		</div>
		<div
			class="w-full md:w-1/2 h-[350px] md:h-full mb-8 md:py-12 flex flex-col justify-center text-center"
		>
			<div class="bg-white max-w-[600px] h-full overflow-hidden border rounded-xl shadow-md">
				<Svelvet nodes={initialNodes} edges={initialEdges} />
			</div>
			<!-- <div
				class="sm:hidden bg-white max-w-[600px] h-full overflow-hidden border rounded-xl shadow-md"
			>
				<Svelvet nodes={otherNodes} edges={otherEdges} />
			</div> -->
		</div>
	</div>
</div>
<div class="h-[380px] md:h-[420px] w-screen">
	<div class="flex flex-col-reverse md:flex-row h-full m-12 md:gap-10">
		<div
			class="w-full md:w-1/2 h-[350px] md:h-full mb-8 md:py-12 flex flex-col justify-center items-center text-center "
		>
			<div
				class="overflow-hidden rounded-lg bg-gray-100 w-[320px] md:w-[380px] grid place-items-center wrapper"
			>
				<div class="h-7 w-full bg-gray-300 flex items-center">
					<div class="btn bg-[#FF605C]" />
					<div class="btn bg-[#FFBD44]" />
					<div class="btn bg-[#00CA4E]" />
				</div>
				<div class="typing-demo my-3">npm install svelvet</div>
			</div>
		</div>
		<div class="w-full md:w-1/2 h-full flex flex-col justify-center">
			<h3 class="text-4xl font-bold mb-4 mt-8 text-center md:text-left text-gray-700">
				Get Started Easily
			</h3>
			<p class="mb-4 text-gray-500 text-center md:text-left">
				Start mapping out your ideas with our NPM package. Simply provide your node data to the
				<code class="bg-rose-100 rounded-lg p-1">Svelvet</code> component and you're ready to show off
				your interactive diagram - no extra configuration needed!
			</p>
			<a
				href="/docs/installation"
				class="hidden md:flex shadow-md hover:shadow-transparent w-fit border mt-5 py-1 px-4 rounded-full hover:ease-in duration-100 hover:text-rose-400 hover:bg-transparent bg-rose-400 text-white border-rose-400"
				>Installation</a
			>
		</div>
	</div>
</div>
<div class="h-[320px] w-screen bg-gradient-to-r from-[#F66F52] to-rose-400 text-white">
	<div class=" h-full m-12 md:m-24">
		<div class=" h-full w-full flex flex-col justify-center">
			<h3 class="text-4xl font-bold mb-4 text-center">Contributors</h3>
			<p class="mb-4 text-gray-100 text-center">
				Svelvet is open source and has room for many more features. We welcome contributors!
			</p>
			<a
				href="/docs/installation"
				class="self-center w-fit border border-white mt-5 py-1 px-4 rounded-full hover:ease-in duration-100 hover:text-white hover:bg-transparent bg-white text-rose-700 "
				>See Our GitHub</a
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

	.wrapper {
		box-shadow: 3px 3px 15px 3px rgba(0, 0, 0, 0.1);
	}

	.btn {
		float: left;
		margin-left: 7px;
		width: 12px;
		height: 12px;
		border-radius: 100%;
	}

	.typing-demo {
		width: 20ch;
		animation: typing 4s steps(20), blink 0.5s step-end infinite alternate;
		animation-iteration-count: infinite;
		white-space: nowrap;
		overflow: hidden;
		border-right: 3px solid;
		font-family: monospace;
		font-size: 16px;
	}

	/* @keyframes typing {
		from {
			width: 0;
		}
	} */
	@keyframes typing {
		0% {
			width: 0%;
		}
		25%,
		100% {
			width: 20ch;
		}
	}

	@keyframes blink {
		50% {
			border-color: transparent;
		}
	}
</style>
