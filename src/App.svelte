	<script>
	import Svelvet from "../svelvetrabbit";
	import BlueThing from "./BlueThing.svelte";
	import w from "./BlueThing.svelte";
	import h from "./BlueThing.svelte";

	console.log('width ', w);
	console.log('height ', h);

		const initialNodes = [
		  // {
		  //   id: 1,
		  //   position: { x: 150, y: -200 },
		  //   data: {custom: BlueThing},
		  //   width: 300,
		  //   height: 300,
		  //   bgColor: "white"
		  // },
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
				className: 'customClass',
		    textColor: "#3F6FD6",
		    bgColor: "white"
		  },
		  {
		    id: 4,
		    position: { x: 250, y: 150 },
		    data: { },
		    width: 150,
		    height: 100,
		    textColor: "white",
		    borderColor: "transparent",
		    bgColor: "black",
				image: true,
				src: "https://www.dropbox.com/s/bunxvjowj5fxosa/de3t.jpg?raw=1",
				alt: "a carrot"
		  },
		  {
		    id: 5,
		    position: { x: 250, y: 250 },
		    data: { },
		    width: 90,
		    height: 110,
		    bgColor: "white",
				image: true,
				src: 'https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters/large/800/Philip-J-Fry.Futurama.webp'
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
		];

		const initialEdges = [
		  // { id: "e1-2", source: 1, target: 2, label: "connection" },
		  { id: "e2-3", source: 2, target: 5, label: "label" },
		  {
		    id: "e1-4",
		    source: 5,
		    target: 6,
		    label: "box",
		    animate: true,
		    arrow: true
		  },
		  { id: "e2-5", source: 6, target: 7, animate: true, type: 'step' }
		];

	console.log(initialNodes[1]);
	console.log('nodes from the User', initialNodes);
</script>

<main>
	<h1>Hello Svelvet Team!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	<Svelvet  nodes={initialNodes} width={800} height={800} initialZoom={5} initialLocation={initialNodes[2].position} edges={initialEdges} bgColor={'#EEEEEE'} background/>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
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

	:global(.customClass) {
		background-color: darkcyan;
		color: white;
		border-radius: 50%;
		width: 120px;
		height: 60px;
		border-color: cyan;
	}

	:global(.newNode) {
		background-color: #cde1f3;
		color: black;
		border-radius: 5%;
		width: 100px;
		height: 40px;
		/* box-shadow: 1px 1px 1px 4px black; */
	}
</style>