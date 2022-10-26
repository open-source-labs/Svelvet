<script lang="ts">
	// @ts-nocheck
	
	
		import Svelvet from 'svelvetcake';
		
		  const initialNodes = [
			{
			  id: 1,
			  position: { x: 185, y: 20 },
			//   data: {html: `<iframe width="640" height="480" allow="fullscreen; autoplay; encrypted-media" src="https://codeincomplete.com/games/racer/" frameborder="0" allowfullscreen="true" msallowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" allowpaymentrequest="false" referrerpolicy="unsafe-url" sandbox="allow-same-origin allow-forms allow-scripts allow-pointer-lock allow-orientation-lock allow-popups" scrolling="no"></iframe>`},
			  data: { html: ` <video width="480" height="360" src="https://i.imgur.com/zdT6tSz.mp4" autoplay loop></video>` },
			  // data: {html: `<h1> WE DEM BOIZ MONSTARZ </h1` },
			  width:  490,
			  height: 370,
			  bgColor: "white",
			},
			{
			  id: 2,
			  position: { x: 0, y: 330 },
			  data: { label: "LEADER" },
			  width: 70,
			  height: 40,
			  bgColor: "white",
			  clickCallback: node => console.log(coreSvelvetStore)
			},
			{
			  id: 3,
			  position: { x: 240, y: 680 },
			  data: { html: `<button> Click Me! </button>` },
			  width: 100,
			  height: 50,
			  bgColor: "blue",
	  
			},
			{
			  id: 4,
			  position: { x: 700, y: 530 },
			  data: { html: `<label for="lname">Message Box:</label>
	  <input type="text" id="lname" name="lname" form="form1">` },
			  width: 200,
			  height: 50,
			  bgColor: "white"
			},
			{
			  id: 5,
			  position: { x: 30, y: 510 },
			  data: { label: "no handle" },
			  width: 80,
			  parentNode: 2,
			  height: 40,
			  bgColor: "white",
	  
			},
			{
			  id: 6,
			  position: { x: 450, y: 580 },
			  data: { html: ` <ul><li>Coffee</li><li>Tea</li><li>Milk</li></ul> ` },
			  width: 100,
			  height: 80,
			  bgColor: "white",
	  
			}
		  ];
	  
	  
		const initialEdges = [
		  { id: 'e1-2', source: 1, target: 2, label: 'edge label' },
		  { id: 'e2-3', source: 2, target: 3, animate: true, label: 'animated edges' },
		  { id: 'e1-4', source: 1, target: 4, type: 'step', animate: true, edgeColor: '#FF4121' },
		  { id: 'e2-5', source: 2, target: 5, label: 'colored edges', animate: true, arrow: true, edgeColor: '#FF4121', labelBgColor: '#1F2937', labelTextColor: '#FFE4E6' },
		  { id: 'e2-5', source: 4, target: 6, type: 'straight' },
		  { id: 'e2-5', source: 3, target: 6, type: 'smoothstep', label: 'colored label', labelBgColor: '#FF4561', labelTextColor: 'white', animate: true }
		];

let code_sample = `< Svelvet snap={true} snapTo={30} />`
</script>

<div>
  <h2 class="text-4xl font-semibold mb-12">HTML Enhancements</h2>

  <p class="my-4 text-gray-600">
    We are proud to announce that <code class="code">Svelvet 4.0</code> (SvelvetCake) supports full HTML rendering within nodes. The only limit to this feature is your imagination! Whether it's are the bounds of imagining the po <code class="code">Svelvet</code> offers for a unique user experience when building out your data diagram-flow. Although simplisitc in its design, snap-to-grid can be as energetic or as subtle as you want. 
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