<script lang="ts">
	import Svelvet from "svelvetcake";
    import Logo from '../../assets/High Resolution Logo.png'
	const initialNodes = [
	  {
		id: 1,
		position: { x: 453, y: 70 },
		data: { label: "MAIN NODE"},
		// data: { html: ` <video width="360" height="240" src="https://i.imgur.com/VoBl9wh.mp4" controls autoplay loop></video> ` },
		// data: {html: `<h1> WE DEM BOIZ MONSTARZ </h1>` },
		width:  120,
		height: 60,
		bgColor: '#FFE4E6'
	  },
	  {
		id: 2,
		position: { x: 250, y: 300 },
		data: { label: "Snap!" },
		width: 70,
		height: 40,
		bgColor: "white",

	  },
	  {
		id: 3,
		position: { x: 463, y: 400 },
		data: { html: `<button> Svelvet 4.0 </button>` },
		width: 100,
		height: 40,
        bgColor: '#FFE4E6'

	  },
	  {
		id: 4,
		position: { x: 700, y: 210 },
		data: { label: 'SvelvetCake'},
		width: 300,
		height: 225,
		image: true,
		bgColor: "white",
		src: Logo
	  },
	  {
		id: 5,
		position: { x: 150, y: 210 },
		data: { label: "Drag Me" },
		width: 80,
		height: 40,
		bgColor: "white",

	  },
	  {
		id: 6,
		position: { x: 550, y: 230 },
		data: { html: ` <ul><li>SNAP</li><li>THAT</li><li>NODE</li></ul> ` },
		width: 85,
		height: 100,
		bgColor: "white",

	  }
	];

	const initialEdges = [
	  { id: "e1-2", source: 1, target: 2, type: "bezier" },
	  { id: "e1-3", source: 1, target: 3, type: "straight" },
	  {
		id: "e1-4",
		source: 1,
		target: 4,
		type: "bezier",
		animate: true,
		label: "labeled"
	  },
	  {
		id: "e1-5",
		source: 1,
		target: 5,
		type: "bezier",
		noHandle: true
	  },
	  {
		id: "e1-6",
		source: 1,
		target: 6,
		type: "bezier",
		arrow: true
	  }
	];

let code_sample = `< Svelvet snap={true} snapTo={30} />`
</script>

<div>
  <h2 class="text-4xl font-semibold mb-12">Snap-To-Grid</h2>

  <p class="my-4 text-gray-600">
    Snap-To-Grid is a lively feature that <code class="code">Svelvet</code> offers for a unique user experience when building out your data diagram-flow. Although simplisitc in its design, snap-to-grid can be as energetic or as subtle as you want. 
  </p>
  <div class="overflow-hidden my-8 border border-gray-200 rounded-lg shadow-lg shadow-slate-100">
    <Svelvet
      nodes={initialNodes}
      edges={initialEdges}
      width={1500}
      height={500}
      movement={true}
	  background
      snap={true}
      snapTo={30}
    />
  </div>
  <p class="my-4 text-gray-600">
     The diagram above features the snap-to-grid functioanlity whenver a node's position is changed. Upon Svelvet 4.0's release, snap-to-grid can easily be modifed within the Svelvet component declaration by changing the values passed into the <code class="code">snap</code> and <code class="code">snapTo</code> props. <br><br> 
     <!-- <code> <Svelvet nodes={initialNodes} edges={initialEdges} background snap={true} snapTo={30}/> </code>  -->

     <code class="block rounded-md p-3 bg-rose-100 text-rose-600 w-full sm:w-3/4 md:w-1/2"
      > {code_sample}
    </code>

     <br>If no specified numerical value is passed into snapTo, the default value is set to 30. 
  </p>
</div>

<style>
    
</style>