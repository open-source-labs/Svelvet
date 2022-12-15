	<script>
	import Svelvet from "../svelvetrabbit";
	import BlueThing from "./BlueThing.svelte";
	import w from "./BlueThing.svelte";
	import h from "./BlueThing.svelte";

	console.log('width ', w);
	console.log('height ', h);

		const initialNodes = [
		  {
		    id: 1,
		    position: { x: 150, y: -200 },
		    data: {custom: BlueThing},
		    width: 300,
		    height: 300,
		    bgColor: "white"
		  },
		  {
		    id: 2,
		    position: { x: 50, y: 300 },
		    data: { label: "borderColor" },
				targetPosition: 'left',
				sourcePosition: 'right',
		    width: 150,
		    height: 40,
		    borderColor: "red",
		    bgColor: "white"
		  },
		  {
		    id: 3,
		    position: { x: 50, y: 150 },
		    data: { label: "textColor" },
		    width: 150,
		    height: 40,
		    textColor: "#3F6FD6",
		    bgColor: "white"
		  },
		  {
		    id: 4,
		    position: { x: 250, y: 150 },
		    data: { },
		    width: 150,
		    height: 150,
		    textColor: "white",
		    borderColor: "transparent",
		    bgColor: "black",
				image: true,
				src: "https://www.alimentarium.org/sites/default/files/media/image/2016-10/AL012-02%20carotte_0.jpg",
				alt: "a carrot"
		  },
		  {
		    id: 5,
		    position: { x: 250, y: 250 },
		    data: { label: "width and height" },
		    width: 90,
		    height: 110,
		    bgColor: "white"
		  },
		  {
		    id: 6,
		    position: { x: 250, y: 400 },
		    data: { label: "borderRadius" },
		    width: 100,
		    height: 100,
		    bgColor: "orange",
		    borderRadius: 30
		  },
		  {
		    id: 7,
		    position: { x: 50, y: 500 },
		    data: { label: "clickCallback" },
		    width: 150,
		    height: 40,
		    bgColor: "white",
		    clickCallback: node => console.log(node)
		  },
		  {
		    id: 8,
		    position: { x: 1000, y: 400 },
		    data: { label: "test" },
		    width: 100,
		    height: 100,
		    bgColor: "orange",
		    borderRadius: 30
		  },
		];

		const initialEdges = [
		  { id: "e1-2", source: 1, target: 2, label: "connection" },
		  { id: "e2-3", source: 2, target: 5, label: "label" },
		  {
		    id: "e1-4",
		    source: 5,
		    target: 6,
		    label: "box",
		    animate: true,
		    arrow: true
		  },
		  { id: "e2-5", source: 6, target: 7, animate: true }
		];

	export let name;
</script>

<main>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	<Svelvet nodes={initialNodes} width={800} height={800} initialZoom={2} initialLocation={initialNodes[1].position} edges={initialEdges} bgColor={'pink'} background/>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>