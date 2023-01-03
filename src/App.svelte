	<script>
	import Svelvet from "../svelvetrabbit";
	// import Svelvet from 'svelvetrabbits'
	// import state from "./state.json"
	import BlueThing from "./BlueThing.svelte";
	import w from "./BlueThing.svelte";
	import h from "./BlueThing.svelte";

	// const initialState = {"nodes":[{"id":2,"position":{"x":-242.28277567221326,"y":498.50290453748175},"data":{"label":"borderColor"},"targetPosition":"left","sourcePosition":"right","width":150,"height":40,"borderColor":"red","bgColor":"white"},{"id":3,"position":{"x":-152.200562546279,"y":254.8915418208822},"data":{"label":"textColor"},"width":120,"height":60,"className":"customClass","textColor":"#3F6FD6","bgColor":"white"},{"id":4,"position":{"x":46.535683937806816,"y":190.44011250925584},"data":{},"width":150,"height":100,"textColor":"white","borderColor":"transparent","bgColor":"black","image":true,"src":"https://www.dropbox.com/s/bunxvjowj5fxosa/de3t.jpg?raw=1","alt":"a carrot"},{"id":5,"position":{"x":408.2961339748301,"y":280.3300843819419},"data":{},"width":200,"height":150,"bgColor":"white"},{"id":6,"position":{"x":282.74109765506915,"y":407.73976111834054},"data":{"label":"borderRadius"},"width":100,"height":100,"bgColor":"orange","borderRadius":30},{"id":7,"position":{"x":76.34119197639203,"y":676.8382991235695},"data":{"label":"clickCallback"},"width":150,"height":40,"bgColor":"white"},{"id":8,"position":{"x":-66.73281225024436,"y":790.5322855921713},"data":{"label":"New Node"},"width":100,"height":40,"className":"newNode","bgColor":"white"},{"id":9,"position":{"x":221.57874884621657,"y":804.753932103656},"data":{"label":"New Node"},"width":100,"height":40,"className":"newNode","bgColor":"white"},{"id":10,"position":{"x":-69.88166615920065,"y":545.6533206048612},"data":{"label":"New Node"},"width":100,"height":40,"className":"newNode","bgColor":"white","sourcePosition":"right","targetPosition":"left"},{"id":11,"position":{"x":-34.8917752323496,"y":432.5433447795277},"data":{"label":"New Node"},"width":100,"height":40,"className":"newNode","bgColor":"white"}],"edges":[{"id":"e2-3","source":2,"target":5,"label":"label","sourceX":-92.28277567221326,"sourceY":518.5029045374818,"sourcePosition":"right","targetX":508.2961339748301,"targetY":280.3300843819419,"targetPosition":"top"},{"id":"e1-4","source":5,"target":6,"label":"box","animate":true,"arrow":true,"sourceX":508.2961339748301,"sourceY":430.3300843819419,"sourcePosition":"bottom","targetX":332.74109765506915,"targetY":407.73976111834054,"targetPosition":"top"},{"id":"e2-5","source":6,"target":7,"animate":true,"type":"step","sourceX":332.74109765506915,"sourceY":507.73976111834054,"sourcePosition":"bottom","targetX":151.34119197639203,"targetY":676.8382991235695,"targetPosition":"top"},{"id":"0q74k-cgs33","source":7,"target":8,"targetX":-16.732812250244365,"targetY":790.5322855921713,"animate":false,"sourceX":151.34119197639203,"sourceY":716.8382991235695,"sourcePosition":"bottom","targetPosition":"top"},{"id":"gkfsp-iiaxo","source":7,"target":9,"targetX":271.57874884621657,"targetY":804.753932103656,"animate":false,"sourceX":151.34119197639203,"sourceY":716.8382991235695,"sourcePosition":"bottom","targetPosition":"top"},{"id":"9e1ty-3l4h9","source":4,"target":7,"sourceX":121.53568393780682,"sourceY":290.44011250925587,"animate":false,"targetX":151.34119197639203,"targetY":676.8382991235695,"targetPosition":"top","sourcePosition":"bottom"},{"id":"9e1ty-3l4h9","source":4,"target":7,"sourceX":121.53568393780682,"sourceY":290.44011250925587,"animate":false,"targetX":151.34119197639203,"targetY":676.8382991235695,"targetPosition":"top","sourcePosition":"bottom"},{"id":"hl6ef-x9ygd","source":2,"target":10,"targetX":-69.88166615920065,"targetY":565.6533206048612,"animate":false,"sourceX":-92.28277567221326,"sourceY":518.5029045374818,"sourcePosition":"right","targetPosition":"left"},{"id":"iiawu-ppic4l","source":3,"target":11,"targetX":15.108224767650398,"targetY":432.5433447795277,"animate":false,"sourceX":-92.200562546279,"sourceY":314.8915418208822,"sourcePosition":"bottom","targetPosition":"top"}]}
	// const initialNodes = initialState.nodes;
	// const initialEdges = initialState.edges;
	
		// console.log('statey state', state);
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
		    position: { x: 450, y: 250 },
		    data: { custom: BlueThing },
		    width: 200,
		    height: 150,
		    bgColor: "white",
		  },
		  {
		    id: 6,
		    position: { x: 250, y: 500 },
		    data: { label: "borderRadius" },
		    width: 100,
		    height: 100,
		    bgColor: "orange",
		    borderRadius: 30
		  },
		  {
		    id: 7,
		    position: { x: 50, y: 600 },
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
   
</script>

<main>
	<h1>Hello Svelvet Team!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	<Svelvet  
	  nodes={initialNodes} 
	  width={800} 
		height={800} 
		initialZoom={5} 
		initialLocation={initialNodes[2].position} 
		edges={initialEdges} 
		bgColor={'#EEEEEE'} 
		background 
		boundary={{x: 2000, y: 1500}}
		nodeLink
		
		
		minimap={true}
	/>
	<!-- <a download='info.txt' id='downloadState'>Download</a> -->
	<!-- <input type="text" id="store-input">
	<button id="store-input-btn">Upload</button> -->
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