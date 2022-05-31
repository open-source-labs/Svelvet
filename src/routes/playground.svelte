<script>
	// import Svelvet from '$lib/Containers/Svelvet/index.svelte';
	import Svelvet from 'svelvet';
	import logo from '../assets/Logo 1 white.svg';

	const initialNodes = [
		{
			id: 1,
			type: 'input',
			position: { x: 100, y: 50 },
			data: { label: 'Input' },
			width: 175,
			height: 40,
			bgColor: 'white'
		},
		{
			id: 2,
			type: 'default',
			position: { x: 350, y: 250 },
			data: { label: 'Default' },
			width: 175,
			height: 40,
			bgColor: 'white'
		},
		{
			id: 3,
			type: 'output',
			position: { x: 40, y: 400 },
			data: { label: 'Output' },
			width: 175,
			height: 40,
			bgColor: 'white'
		},
		{
			id: 4,
			type: 'output',
			position: { x: 400, y: 500 },
			data: { label: 'Bye!' },
			width: 175,
			height: 40,
			bgColor: 'white'
		}
	];
	const initialEdges = [
		{ id: 'e1-2', source: 1, type: 'straight', target: 2, label: 'labeled edge' },
		{ id: 'e2-3', source: 2, target: 3, label: 'another label' },
		{ id: 'e2-4', source: 2, target: 4, label: 'animated edge', animate: true }
	];
</script>

<Svelvet nodes={initialNodes} edges={initialEdges} />
<div
	class="flex items-center justify-center p-16 w-[400px] bg-gradient-to-r from-[#F66F52] to-rose-400"
>
	<img src={logo} alt="Logo" class="aspect-ratio-auto h-8" />
	<a
		id="home"
		href="/"
		class="text-3xl text-white font-nunito font-medium tracking-wide ml-2 mr-6 svelvet">svelvet</a
	>
</div>
<iframe
	src="https://codesandbox.io/embed/basic-usage-71vweu?autoresize=1&codemirror=1&fontsize=14&hidenavigation=1&module=%2FApp.svelte&theme=light"
	style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
	title="basic-usage"
	allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
	sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

<style>
	.svelvet {
		text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
	}

	img {
		filter: drop-shadow(1px 1px 1px rgb(0, 0, 0, 0.2));
	}
</style>
